'use server';

import { headers } from 'next/headers';
import { deliverLead, hasLeadBackend, leadSchema, rateLimit } from '@/lib/leads';

export type BriefResult = 'success' | 'fallback' | 'invalid';

/**
 * A project brief from the contact band, sent straight to the team's inbox.
 * Same pipeline as the contact form — with no backend configured (or a failed
 * send) the form opens a prefilled email instead, so it never silently fails.
 */
export async function submitBrief(input: {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
}): Promise<BriefResult> {
  if (input.website) return 'success';

  const parsed = leadSchema.safeParse({
    name: input.name,
    email: input.email,
    company: input.company ?? '',
    type: 'Project brief',
    message: input.message.slice(0, 4000),
    locale: 'en',
  });
  if (!parsed.success) return 'invalid';

  const ip = ((await headers()).get('x-forwarded-for') ?? 'local').split(',')[0]?.trim() || 'local';
  if (!rateLimit(ip) || !hasLeadBackend()) return 'fallback';

  try {
    await deliverLead(parsed.data);
    return 'success';
  } catch (error) {
    console.error('[brief] lead delivery failed', error);
    return 'fallback';
  }
}
