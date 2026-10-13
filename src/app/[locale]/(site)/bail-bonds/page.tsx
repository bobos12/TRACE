import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getBailBonds, getPlatforms, getProject, getSite } from '@/lib/content';
import { jsonLd, pageMetadata, siteUrl } from '@/lib/seo';
import { organizationRef } from '@/lib/structured-data';
import { Process } from '@/components/sections/Process';
import { ContactBand } from '@/components/sections/ContactBand';
import { Faq } from '@/components/sections/Faq';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { BailHero } from '@/components/bail/BailHero';
import { PageStrip } from '@/components/bail/PageStrip';
import { Moment } from '@/components/bail/Moment';
import { Flagship } from '@/components/bail/Flagship';
import { Compare } from '@/components/bail/Compare';
import { Journey } from '@/components/bail/Journey';
import { Assistant } from '@/components/bail/Assistant';
import { Details } from '@/components/bail/Details';
import { Proof } from '@/components/bail/Proof';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = readLocale((await params).locale);
  const { meta } = getBailBonds();
  return pageMetadata({ locale, path: '/bail-bonds', title: meta.title, description: meta.description });
}

/**
 * The bail bonds landing page — written to one agency owner.
 *
 * The moment a family searches (hero, every page of a working agency sliding
 * past, the 2 a.m. search) → that agency, toured screen by screen (Ellison &
 * Reyes) → what we change
 * (before/after, the night shift) → the assistant that works nights → every
 * detail we build → how we work and who we are → questions → book a call.
 * The mocks use one fictional agency (Ironwood), labelled as a concept;
 * Ellison & Reyes is a demo agency on real software, labelled as one.
 */
export default async function BailBondsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const copy = getBailBonds();
  const flagship = getProject('ellison-reyes');
  if (!flagship?.links.demo) throw new Error('portfolio.json: the /bail-bonds flagship "ellison-reyes" or its demo link is missing');

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.meta.title,
    description: copy.meta.description,
    serviceType: 'Website design and AI assistants',
    audience: { '@type': 'BusinessAudience', name: 'Bail bond agencies' },
    areaServed: { '@type': 'Country', name: 'United States' },
    provider: organizationRef(),
    url: siteUrl('/bail-bonds'),
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <Breadcrumbs trail={[{ name: copy.meta.title, path: '/bail-bonds' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([service, faq]) }} />

      <BailHero copy={copy} />
      <PageStrip strip={copy.flagship.strip} demo={flagship.links.demo} />
      <Moment copy={copy} />
      <Flagship copy={copy} demo={flagship.links.demo} caseStudy={`/work/${flagship.slug}`} />
      <Compare copy={copy} />
      <Journey copy={copy} />
      <Assistant copy={copy} />
      <Details copy={copy} />
      <Process site={site} copy={copy.process} />
      <Proof
        copy={copy}
        platforms={copy.proof.platforms.flatMap((slug) => getPlatforms(locale).filter((p) => p.slug === slug))}
      />

      <Faq id="bail-faq-title" title={copy.faq.title} items={copy.faq.items} />

      <ContactBand site={site} locale={locale} title={copy.cta.title}
        context={copy.cta.context}
        services={copy.cta.services}
      />
    </>
  );
}
