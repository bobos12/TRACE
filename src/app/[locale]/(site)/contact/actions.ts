'use server';

import { headers } from 'next/headers';
import { deliverLead, hasLeadBackend, leadSchema, rateLimit } from '@/lib/leads';

export interface ContactState {
  status: 'idle' | 'success' | 'error' | 'invalid';
  /** Field name → message, for inline errors. */
  errors?: Record<string, string>;
  /** Echoed back so the client can offer the WhatsApp fallback with context. */
  values?: Record<string, string>;
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;

  // Honeypot: a bot filled the hidden field. Look like a success and drop it.
  if (raw.website) return { status: 'success' };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
    return { status: 'invalid', errors, values: raw };
  }

  // Per-IP rate limit. Behind Vercel, x-forwarded-for is the client address.
  const head = await headers();
  const ip = (head.get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!rateLimit(ip)) {
    return { status: 'error', values: raw };
  }

  if (!hasLeadBackend()) {
    // Nothing configured — the client takes over and opens WhatsApp.
    return { status: 'error', values: raw };
  }

  try {
    await deliverLead(parsed.data);
    return { status: 'success' };
  } catch (error) {
    console.error('[contact] lead delivery failed', error);
    return { status: 'error', values: raw };
  }
}
