import type { Locale } from '@/i18n/routing';
import { contact } from '@/lib/contact';
import { getSite } from '@/lib/content';
import { siteUrl } from '@/lib/seo';

/**
 * Organization + ProfessionalService for the home page.
 * areaServed covers the markets in docs/01-brief.md: Saudi Arabia, Egypt, UAE.
 */
export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const site = getSite(locale);

  const sameAs = Object.values(contact.social).filter((url) => url && !url.includes('REPLACE'));

  const json = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${siteUrl('')}/#organization`,
    name: 'ATHR',
    alternateName: 'أثر',
    url: siteUrl(`/${locale}`),
    logo: siteUrl('/icon-512.png'),
    image: siteUrl(site.meta.ogImage),
    description: site.meta.description,
    slogan: site.footer.tagline,
    email: contact.email,
    telephone: contact.phone,
    areaServed: [
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    knowsLanguage: ['ar', 'en'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: contact.phone,
        email: contact.email,
        availableLanguage: ['Arabic', 'English'],
        areaServed: ['SA', 'EG', 'AE'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: contact.phoneSecondary,
        availableLanguage: ['Arabic', 'English'],
        areaServed: ['EG'],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
    // TODO: add the Saudi commercial registration number here and in the footer.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default OrganizationJsonLd;
