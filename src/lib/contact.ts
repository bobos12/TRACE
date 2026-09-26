/**
 * Contact helpers — the site's two primary conversion actions.
 * Numbers live in content/contact.json (E.164, no spaces).
 * Extended from starters/contact.ts: adds placement typing, the analytics
 * bridge to Vercel Analytics, and the WhatsApp fallback used by the form.
 */
import { track as vercelTrack } from '@vercel/analytics';
import { contact } from '@/lib/contact-data';
import type { Locale } from '@/i18n/routing';

export { contact };

export type ContactChannel = 'whatsapp' | 'phone' | 'email' | 'form';

/** Placement values, per docs/06-conversion.md. */
export type Placement =
  | 'nav'
  | 'nav-menu'
  | 'hero'
  | 'services'
  | 'work'
  | 'contact-band'
  | 'brief'
  | 'float'
  | 'mobile-bar'
  | 'contact-page'
  | 'footer'
  | '404'
  | `service:${string}`
  | `project:${string}`;

/** WhatsApp deep link with exactly this message — the brief form writes its own. */
export function whatsappTextHref(text: string): string {
  const number = contact.whatsapp.replace(/[^\d]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** WhatsApp deep link with a prefilled, context-aware message. */
export function whatsappHref(locale: Locale, context?: string): string {
  const base = contact.whatsappMessage[locale];
  return whatsappTextHref(context ? `${base} — ${context}` : base);
}

/** tel: link. Always show contact.phoneDisplay beside it — people trust the number. */
export function phoneHref(secondary = false): string {
  return `tel:${secondary ? contact.phoneSecondary : contact.phone}`;
}

export function mailHref(subject?: string): string {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${contact.email}${q}`;
}

/**
 * One analytics event. Goes to Vercel Web Analytics, and to dataLayer if a tag
 * manager is present — swapping in Plausible means changing this function only.
 */
export function track(name: string, data?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  vercelTrack(name, data);
  (window as Window & { dataLayer?: unknown[] }).dataLayer?.push({ event: name, ...data });
}

export function trackContact(channel: ContactChannel, placement: Placement): void {
  track('contact_click', { channel, placement });
}

/**
 * Attributes every outbound contact link shares.
 * WhatsApp opens in a new tab on desktop; `tel:` and `mailto:` never should.
 */
export const externalLinkProps = {
  target: '_blank' as const,
  rel: 'noopener' as const,
};
