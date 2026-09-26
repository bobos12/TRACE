import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/sections/LegalPage';
import { ContactBand } from '@/components/sections/ContactBand';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = readLocale((await params).locale);
  const site = getSite(locale);
  return pageMetadata({
    locale,
    path: '/privacy',
    title: site.pages.legal.privacy.title,
    description: site.pages.legal.privacy.sections[0]?.body,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);
  const site = getSite(locale);

  return (
    <>
      <LegalPage copy={site.pages.legal.privacy} reviewBadge={site.pages.legal.reviewBadge} />
      <ContactBand site={site} locale={locale} context={site.pages.legal.privacy.title} />
    </>
  );
}
