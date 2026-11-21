import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { jsonLd, pageMetadata, siteUrl } from '@/lib/seo';
import { organizationRef } from '@/lib/structured-data';
import { Pricing, SoftwarePricing } from '@/components/pricing/Pricing';
import { PricingCompare } from '@/components/pricing/PricingCompare';
import { Faq } from '@/components/sections/Faq';
import { ContactBand } from '@/components/sections/ContactBand';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = readLocale((await params).locale);
  const seo = getSite(locale).pricing.page.seo;
  return pageMetadata({ locale, path: '/pricing', title: seo.title, description: seo.description });
}

/**
 * The website plans, the software on its own, every feature side by side,
 * the questions about money, and the call.
 */
export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const copy = site.pricing;

  // The software plans as products with their monthly offers, and the questions —
  // both built from the same content as the page, so the prices never drift.
  const products = copy.software.plans.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.tagline,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    provider: organizationRef(),
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'USD',
      url: siteUrl(`/pricing#trace-${p.id}`),
    },
  }));
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs trail={[{ name: copy.eyebrow, path: '/pricing' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([...products, faq]) }} />
      <Pricing site={site} variant="page" />
      <SoftwarePricing site={site} />
      <PricingCompare site={site} />
      <Faq id="pricing-faq-title" title={copy.page.faqTitle} items={copy.page.faq} />
      <ContactBand site={site} locale={locale} context={copy.eyebrow} />
    </>
  );
}
