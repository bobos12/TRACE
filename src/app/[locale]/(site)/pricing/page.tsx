import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { Pricing } from '@/components/pricing/Pricing';
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

/** The plans, every feature side by side, the questions about money, and the call. */
export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const copy = site.pricing;

  return (
    <>
      <Breadcrumbs trail={[{ name: copy.eyebrow, path: '/pricing' }]} />
      <Pricing site={site} variant="page" />
      <PricingCompare site={site} />
      <Faq id="pricing-faq-title" title={copy.page.faqTitle} items={copy.page.faq} />
      <ContactBand site={site} locale={locale} context={copy.eyebrow} />
    </>
  );
}
