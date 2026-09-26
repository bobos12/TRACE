/**
 * The contact details, client-safe.
 *
 * Deliberately separate from `lib/content.ts`: that module runs Zod over every
 * JSON file in `content/`, and client components need the phone number and the
 * WhatsApp message to build hrefs. Importing it from a client component would
 * pull Zod *and* all four content files into the browser bundle.
 *
 * `lib/content.ts` validates this same JSON at build time, so the shape here is
 * still guaranteed — the schema just doesn't ride along to the browser.
 */
import contactJson from '@content/contact.json';

export interface ContactDetails {
  whatsapp: string;
  phone: string;
  phoneDisplay: string;
  phoneSecondary: string;
  phoneSecondaryDisplay: string;
  email: string;
  hours: { en: string; ar: string };
  responseTime: { en: string; ar: string };
  cities: { en: string[]; ar: string[] };
  whatsappMessage: { en: string; ar: string };
  social: { linkedin: string; x: string; instagram: string; behance: string };
}

export const contact = contactJson as ContactDetails;
