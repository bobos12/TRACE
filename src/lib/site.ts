import { contact } from '@/lib/contact-data';
import { getSite } from '@/lib/content';
import { routing } from '@/i18n/routing';

/**
 * The studio's identity, in one place. Metadata, the sitemap, robots.txt and
 * the structured data all read from here.
 *
 * The origin is fixed, not read from the environment: a preview or local build
 * must still point canonicals, OG URLs and JSON-LD at production. Vercel marks
 * preview deployments noindex on its own.
 */
export const SITE_URL = 'https://trace-studio.tech';

/** The written company name. The logo stays the TRACE wordmark. */
export const BRAND_NAME = 'Trace Studio';
export const ALTERNATE_NAME = 'Trace';
/** The home page's meta description (content/site.en.json → meta). */
export const BRAND_DESCRIPTION = getSite(routing.defaultLocale).meta.description;

/** Square brand mark used as the Organization logo (512×512). */
export const BRAND_LOGO = { path: '/icon-512.png', width: 512, height: 512 };

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Verified company profiles, from content/contact.json → social. An empty
 * value or one still containing REPLACE is left out, so a profile goes live
 * by adding its URL there and nowhere else.
 */
export const SOCIAL_PROFILES: string[] = Object.values(contact.social).filter(
  (url): url is string => typeof url === 'string' && /^https:\/\//.test(url) && !url.includes('REPLACE'),
);

/** "@handle" for twitter:site, taken from the X profile when there is one. */
export const X_HANDLE: string | undefined = (() => {
  const match = SOCIAL_PROFILES.map((url) => url.match(/^https:\/\/(?:www\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/?$/))
    .find(Boolean);
  return match ? `@${match[1]}` : undefined;
})();
