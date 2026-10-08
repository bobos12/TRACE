/**
 * Contact helpers — the site's conversion actions, in order of weight:
 * book a call, email, then phone for those who prefer it.
 * Details live in content/contact.json.
 * Extended from starters/contact.ts: adds placement typing and the analytics
 * bridge to Vercel Analytics.
 */
import { track as vercelTrack } from '@vercel/analytics';
import { contact } from '@/lib/contact-data';

export { contact };

export type ContactChannel = 'booking' | 'email' | 'phone' | 'form';

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
  | 'chat'
  | `service:${string}`
  | `project:${string}`
  | `landing:${string}`;

/** Is the scheduling link real yet? Placeholders still contain REPLACE. */
export const hasBooking = !contact.booking.includes('REPLACE');

/**
 * Where "Book a call" goes: the scheduling page, or — until one is set in
 * content/contact.json — the contact page, so the button never dead-ends.
 */
export function bookingHref(): string {
  return hasBooking ? contact.booking : '/contact';
}

/** The booking link opens in a new tab only when it leaves the site. */
export const bookingLinkProps = hasBooking
  ? { target: '_blank' as const, rel: 'noopener' as const }
  : {};

/** tel: link. Always show contact.phoneDisplay beside it — people trust the number. */
export function phoneHref(): string {
  return `tel:${contact.phone}`;
}

export function mailHref(subject?: string, body?: string): string {
  const params = [
    subject ? `subject=${encodeURIComponent(subject)}` : '',
    body ? `body=${encodeURIComponent(body)}` : '',
  ].filter(Boolean);
  return `mailto:${contact.email}${params.length ? `?${params.join('&')}` : ''}`;
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

