import { z } from 'zod';
import { rateLimit } from '@/lib/leads';

/**
 * Every step a prospect takes on the demo video page and in the demos —
 * video plays and progress, pages, clicks, form steps, submissions — arrives
 * here in small batches from /demos/_shared/trace-track.js and is forwarded,
 * with location and device added, to the campaign tool's webhook:
 *
 *   TRACKING_WEBHOOK_URL     where to POST each batch (the CRM's ingest endpoint)
 *   TRACKING_WEBHOOK_SECRET  sent as `Authorization: Bearer …`
 *
 * The payload is documented in docs/tracking-events.md. Same origin only; card,
 * bank and PIN values never enter an event. With no webhook set, batches are
 * accepted and dropped (logged in development), so the demos never break.
 */

const MAX_PER_WINDOW = 600;

const id = z.string().trim().min(1).max(120);
const scalar = z.union([z.string().max(2000), z.number(), z.boolean(), z.null()]);

const batchSchema = z.object({
  vid: id,
  sid: id,
  rid: id.optional(),
  ctx: z
    .object({
      landing: z.string().max(500).optional(),
      referrer: z.string().max(500).optional(),
      utm: z.record(z.string().max(40), z.string().max(200)).optional(),
      screen: z.string().max(20).optional(),
      lang: z.string().max(20).optional(),
    })
    .optional(),
  identity: z
    .object({ name: z.string().max(120).optional(), email: z.string().max(160).optional(), phone: z.string().max(40).optional() })
    .optional(),
  events: z
    .array(
      z.object({
        type: z.string().trim().min(1).max(40),
        at: z.string().max(40),
        site: z.string().max(80).optional(),
        page: z.string().max(120).optional(),
        data: z.record(z.string().max(60), scalar).optional(),
      }),
    )
    .min(1)
    .max(60),
});

const header = (h: Headers, name: string) => {
  const v = h.get(name);
  if (!v) return undefined;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

export async function POST(request: Request) {
  const h = request.headers;
  const origin = h.get('origin');
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!origin || !host || new URL(origin).host !== host) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }
  const parsed = batchSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: 'invalid' }, { status: 400 });

  const ip = (h.get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!rateLimit(`events:${ip}`, MAX_PER_WINDOW)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  const payload = {
    source: 'trace-studio.tech',
    received_at: new Date().toISOString(),
    visitor: { vid: parsed.data.vid, sid: parsed.data.sid, rid: parsed.data.rid ?? null, ...parsed.data.identity },
    geo: {
      city: header(h, 'x-vercel-ip-city') ?? null,
      region: header(h, 'x-vercel-ip-country-region') ?? null,
      country: header(h, 'x-vercel-ip-country') ?? null,
    },
    user_agent: h.get('user-agent') ?? null,
    ctx: parsed.data.ctx ?? {},
    events: parsed.data.events,
  };

  const url = process.env.TRACKING_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[demo-events]', payload.visitor.rid ?? payload.visitor.vid, payload.events.map((e) => e.type).join(', '));
    }
    return Response.json({ ok: true, forwarded: false }, { status: 202 });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.TRACKING_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.TRACKING_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true, forwarded: true });
  } catch (error) {
    console.error('[demo-events] forward failed', error);
    return Response.json({ ok: true, forwarded: false }, { status: 202 });
  }
}
