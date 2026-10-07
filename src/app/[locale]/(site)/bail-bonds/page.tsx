import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getBailBonds, getClientLogos, getPlatforms, getSite } from '@/lib/content';
import { pageMetadata, siteUrl } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Accordion } from '@/components/ui/Accordion';
import { StopText } from '@/components/brand/Nuqta';
import { Process } from '@/components/sections/Process';
import { ContactBand } from '@/components/sections/ContactBand';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { BailHero } from '@/components/bail/BailHero';
import { Moment } from '@/components/bail/Moment';
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
 * The moment a family searches (hero, the 2 a.m. search) → what we change
 * (before/after, the night shift) → the assistant that works nights → every
 * detail we build → how we work and who we are → questions → book a call.
 * Every demo uses one fictional agency, labelled as a concept.
 */
export default async function BailBondsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const copy = getBailBonds();

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.meta.title,
    description: copy.meta.description,
    serviceType: 'Website design and AI assistants',
    audience: { '@type': 'BusinessAudience', name: 'Bail bond agencies' },
    areaServed: { '@type': 'Country', name: 'United States' },
    provider: { '@type': 'Organization', name: 'TRACE', url: siteUrl() },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([service, faq]) }} />

      <BailHero copy={copy} />
      <Moment copy={copy} />
      <Compare copy={copy} />
      <Journey copy={copy} />
      <Assistant copy={copy} />
      <Details copy={copy} />
      <Process site={site} copy={copy.process} />
      <Proof
        copy={copy}
        clients={getClientLogos(locale)}
        platforms={copy.proof.platforms.flatMap((slug) => getPlatforms(locale).filter((p) => p.slug === slug))}
      />

      <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="bail-faq-title">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 md:col-span-4">
            <Reveal className="eyebrow text-ink-muted">{copy.faq.eyebrow}</Reveal>
            <Reveal as="h2" id="bail-faq-title" className="display-md m-0">
              <StopText>{copy.faq.title}</StopText>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Accordion items={copy.faq.items} />
          </div>
        </Container>
      </section>

      <ContactBand site={site} locale={locale} title={copy.cta.title}
        context={copy.cta.context}
        services={copy.cta.services}
      />
    </>
  );
}
