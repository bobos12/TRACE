/**
 * The contact details, client-safe.
 *
 * Deliberately separate from `lib/content.ts`: that module runs Zod over every
 * JSON file in `content/`, and client components need the booking link and the
 * email to build hrefs. Importing it from a client component would pull Zod
 * *and* all the content files into the browser bundle.
 *
 * `lib/content.ts` validates this same JSON at build time, so the shape here is
 * still guaranteed — the schema just doesn't ride along to the browser.
 */
import contactJson from '@content/contact.json';

export interface ContactDetails {
  booking: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  hours: { en: string };
  responseTime: { en: string };
  cities: { en: string[] };
  whatsappMessage: { en: string };
  social: { linkedin: string; x: string; instagram: string; behance: string };
}

export const contact = contactJson as ContactDetails;
