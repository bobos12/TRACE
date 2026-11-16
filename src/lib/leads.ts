import 'server-only';
import { z } from 'zod';

/**
 * Lead capture. Both backends are optional and selected by environment:
 *   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → insert into `leads`
 *   RESEND_API_KEY + LEADS_TO_EMAIL          → send an email
 * With neither configured the form falls back to email — see
 * `docs/04-pages.md`. It must never silently fail.
 */

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  type: z.string().trim().max(160),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(['en']),
  /** Honeypot: must stay empty. Bots fill every field they find. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type Lead = z.infer<typeof leadSchema>;

export function hasSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEADS_TO_EMAIL);
}

/** Is any backend configured at all? Decides the form's submit affordance. */
export function hasLeadBackend(): boolean {
  return hasSupabase() || hasResend();
}

/* ── rate limiting ────────────────────────────────────────────────
   In-memory and per-instance, which is enough to stop a script hammering
   the form. Swap for Upstash Redis if the site ever runs at scale. */

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max = MAX_PER_WINDOW): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return true;
}

/* ── backends ─────────────────────────────────────────────────── */

async function toSupabase(lead: Lead): Promise<void> {
  const url = `${process.env.SUPABASE_URL!.replace(/\/$/, '')}/rest/v1/leads`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: lead.name,
      company: lead.company || null,
      phone: lead.phone || null,
      email: lead.email,
      service: lead.type,
      message: lead.message,
      locale: lead.locale,
      source: 'website',
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed: ${response.status} ${await response.text()}`);
  }
}

async function toResend(lead: Lead): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL ?? 'TRACE website <onboarding@resend.dev>',
      to: [process.env.LEADS_TO_EMAIL!],
      reply_to: lead.email,
      subject: `New enquiry — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      text: [
        `Name:    ${lead.name}`,
        `Company: ${lead.company || '—'}`,
        `Email:   ${lead.email}`,
        `Phone:   ${lead.phone || '—'}`,
        `Needs:   ${lead.type}`,
        `Locale:  ${lead.locale}`,
        '',
        lead.message,
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend send failed: ${response.status} ${await response.text()}`);
  }
}

/** Deliver a lead to whichever backends are configured. Throws if all fail. */
export async function deliverLead(lead: Lead): Promise<void> {
  const jobs: Array<Promise<void>> = [];
  if (hasSupabase()) jobs.push(toSupabase(lead));
  if (hasResend()) jobs.push(toResend(lead));

  if (jobs.length === 0) {
    throw new Error('No lead backend configured');
  }

  const results = await Promise.allSettled(jobs);
  if (results.every((r) => r.status === 'rejected')) {
    throw new Error(
      results.map((r) => (r.status === 'rejected' ? String(r.reason) : '')).join(' | '),
    );
  }
}

/* ── the demos ────────────────────────────────────────────────────
   Every form in TRACE's demos (public/demos/) reports here, so the team hears
   about each prospect who tries one — and about any real family who lands on
   it. The demos never send card, bank or PIN numbers. */

export const demoEventSchema = z.object({
  kind: z.enum(['application', 'tip', 'checkin', 'reminders', 'lookup', 'payment', 'chat', 'text']),
  /** Which demo it came from; Ellison & Reyes when absent. */
  site: z.string().trim().max(80).optional(),
  /** The demo page it came from (its hash route). */
  page: z.string().trim().max(40),
  /** True when the visitor sent the prefilled sample values untouched. */
  sample: z.boolean(),
  fields: z
    .record(z.string().max(60), z.string().max(6000))
    .refine((f) => Object.keys(f).length > 0 && Object.keys(f).length <= 30),
  /** Where the visitor arrived from before the demo (document.referrer). */
  from: z.string().max(300).optional(),
  /** Honeypot: must stay empty. */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type DemoEvent = z.infer<typeof demoEventSchema>;

const DEMO_TITLES: Record<DemoEvent['kind'], string> = {
  application: 'Bail application (e-signed)',
  tip: 'Wanted tip',
  checkin: 'Defendant check-in',
  reminders: 'Court reminders turned on',
  lookup: 'Payment account lookup',
  payment: 'Payment attempt',
  chat: 'Chat conversation',
  text: 'Text-to-start conversation',
};

export interface DemoVisitor {
  where: string;
  device: string;
  referrer: string;
}

/** Email one demo event to the team. Throws if Resend is not configured or the send fails. */
export async function deliverDemoEvent(event: DemoEvent, visitor: DemoVisitor): Promise<void> {
  if (!hasResend()) throw new Error('Resend is not configured');

  const title = DEMO_TITLES[event.kind];
  const site = event.site || 'Ellison & Reyes';
  const who = event.fields['Cosigner'] || event.fields['Name'] || event.fields['Phone'] || event.fields['From'] || '';
  const email = Object.entries(event.fields).find(([k, v]) => /email/i.test(k) && /^\S+@\S+\.\S+$/.test(v))?.[1];
  const when = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const width = Math.max(8, ...Object.keys(event.fields).map((k) => k.length)) + 2;
  const line = ([k, v]: [string, string]) => (v.includes('\n') ? `${k}:\n${v}` : `${`${k}:`.padEnd(width)}${v || '—'}`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL ?? 'TRACE website <onboarding@resend.dev>',
      to: [process.env.LEADS_TO_EMAIL!],
      ...(email ? { reply_to: email } : {}),
      subject: `Demo · ${event.site ? `${site} · ` : ''}${title}${who ? ` — ${who}` : ''}${visitor.where ? ` (${visitor.where})` : ''}`,
      text: [
        `Someone used the ${site} demo: ${title}.`,
        event.sample
          ? 'They sent the prefilled sample values — most likely an agency owner trying it out.'
          : 'They typed their own details — follow up: a prospect testing it, or a real family.',
        '',
        ...Object.entries(event.fields).map(line),
        '',
        '—',
        `Page:      #${event.page}`,
        `When:      ${when} ET`,
        `Where:     ${visitor.where || 'unknown'}`,
        `Device:    ${visitor.device || 'unknown'}`,
        `Came from: ${visitor.referrer || 'direct'}`,
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend send failed: ${response.status} ${await response.text()}`);
  }
}
