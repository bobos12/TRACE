/**
 * Contact helpers — the site's two primary conversion actions.
 * Numbers live in content/contact.json (E.164, no spaces). Replace the placeholders before launch.
 */
import contact from '../content/contact.json';

type Locale = 'en' | 'ar';

/** WhatsApp deep link with a prefilled, context-aware message. Works on mobile (app) and desktop (web.whatsapp). */
export function whatsappHref(locale: Locale, context?: string): string {
  const number = contact.whatsapp.replace(/[^\d]/g, '');
  const base = contact.whatsappMessage[locale];
  const text = context ? `${base} — ${context}` : base;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** tel: link. Show the formatted number from contact.phoneDisplay next to it. */
export function phoneHref(): string {
  return `tel:${contact.phone}`;
}

/** Fire one analytics event per contact click (wire to your analytics of choice). */
export function trackContact(channel: 'whatsapp' | 'phone' | 'email' | 'form', placement: string) {
  if (typeof window === 'undefined') return;
  // e.g. window.gtag?.('event', 'contact_click', { channel, placement });
  // or   window.plausible?.('Contact', { props: { channel, placement } });
  (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'contact_click', channel, placement });
}
