import type { Locale } from '@/i18n/routing';
import { contact } from '@/lib/contact';
import { getSite } from '@/lib/content';
import { siteUrl } from '@/lib/seo';

/**
 * Organization + ProfessionalService for the home page.
 * TRACE serves US businesses; the engineering team sits in Cairo, Egypt.
 */
export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const site = getSite(locale);

  const sameAs = Object.values(contact.social).filter((url) => url && !url.includes('REPLACE'));

  const json = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${siteUrl('')}/#organization`,
    name: 'TRACE',
    url: siteUrl(''),
    logo: siteUrl('/icon-512.png'),
    image: siteUrl(site.meta.ogImage),
    description: site.meta.description,
    slogan: site.footer.tagline,
    email: contact.email,
    telephone: contact.phone,
    areaServed: [{ '@type': 'Country', name: 'United States' }],
    knowsLanguage: ['en'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: contact.phone,
        email: contact.email,
        availableLanguage: ['English'],
        areaServed: ['US'],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
    // TODO: add the US legal entity (name, state, address) here and in the footer once formed.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default OrganizationJsonLd;
