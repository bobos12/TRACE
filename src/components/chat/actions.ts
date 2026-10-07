'use server';

import { headers } from 'next/headers';
import { deliverLead, hasLeadBackend, leadSchema, rateLimit } from '@/lib/leads';

export type ChatLeadResult = 'success' | 'fallback' | 'invalid';

/**
 * A lead from the assistant: name and email from the inline form, the
 * conversation as the message. Same pipeline as the contact form — with no
 * backend configured (or a failed send) the panel opens a prefilled email.
 */
export async function submitChatLead(input: {
  name: string;
  email: string;
  company?: string;
  transcript: string;
  website?: string;
}): Promise<ChatLeadResult> {
  if (input.website) return 'success';

  const parsed = leadSchema.safeParse({
    name: input.name,
    email: input.email,
    company: input.company ?? '',
    type: 'Website assistant',
    message: input.transcript.slice(0, 4000),
    locale: 'en',
  });
  if (!parsed.success) return 'invalid';

  const ip = ((await headers()).get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!rateLimit(ip) || !hasLeadBackend()) return 'fallback';

  try {
    await deliverLead(parsed.data);
    return 'success';
  } catch (error) {
    console.error('[chat] lead delivery failed', error);
    return 'fallback';
  }
}
