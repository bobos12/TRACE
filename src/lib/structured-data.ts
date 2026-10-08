import type { Locale } from '@/i18n/routing';
import { contact } from '@/lib/contact-data';
import { getLocalServices, getSite } from '@/lib/content';
import { siteUrl } from '@/lib/seo';
import {
  ALTERNATE_NAME,
  BRAND_DESCRIPTION,
  BRAND_LOGO,
  BRAND_NAME,
  ORGANIZATION_ID,
  SOCIAL_PROFILES,
  WEBSITE_ID,
} from '@/lib/site';

/**
 * schema.org nodes for the studio. Only facts the site shows or the owner
 * confirmed: no address, phone, founding date or legal entity until those
 * exist (see PLACEHOLDERS.md).
 */

/** Points at the Organization from another page's markup. */
export function organizationRef() {
  return { '@type': 'Organization', '@id': ORGANIZATION_ID, name: BRAND_NAME, url: siteUrl('/') };
}

export function organizationNode(locale: Locale) {
  const site = getSite(locale);
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    alternateName: ALTERNATE_NAME,
    url: siteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: siteUrl(BRAND_LOGO.path),
      width: BRAND_LOGO.width,
      height: BRAND_LOGO.height,
    },
    image: siteUrl(site.meta.ogImage),
    description: BRAND_DESCRIPTION,
    slogan: site.footer.tagline,
    email: contact.email,
    areaServed: { '@type': 'Country', name: 'United States' },
    knowsAbout: getLocalServices(locale).map((s) => s.title),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: contact.email,
      availableLanguage: ['English'],
    },
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
    // TODO: legalName and address once the US entity is formed — the footer has the same TODO.
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: BRAND_NAME,
    alternateName: ALTERNATE_NAME,
    url: siteUrl('/'),
    description: BRAND_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/** WebSite + Organization, for the home page. */
export function siteGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(), organizationNode(locale)],
  };
}
