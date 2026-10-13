import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { readLocale, routing } from '@/i18n/routing';
import { getBailBonds, getLocalProjects, getSite } from '@/lib/content';

import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/bail/Journey';
import { Showcase } from '@/components/sections/Showcase';
import { AiSection } from '@/components/sections/AiSection';
import { Products } from '@/components/sections/Products';
import { Process } from '@/components/sections/Process';
import { WhyTrace } from '@/components/sections/WhyTrace';
import { Faq } from '@/components/sections/Faq';
import { ContactBand } from '@/components/sections/ContactBand';
import { SiteJsonLd } from '@/components/seo/SiteJsonLd';

/** The case study the home page is built around. */
const DEMO = 'ellison-reyes';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata({ locale: readLocale((await params).locale), path: '/' });
}

/**
 * A bail agency owner's first visit, in the order they decide: who this is
 * for (hero); what an agency site does through the night (the night shift);
 * proof — a whole agency built online (Ellison & Reyes); the AI that answers
 * when they can't; the products (TRACE Bail, TRACE Sign); how we work, in one
 * row; what they get in writing; the questions owners ask first; and the
 * call. Services and platforms live on their own pages; the bail-only story
 * (the 2 a.m. search, before and after) lives on /bail-bonds.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const bail = getBailBonds();
  const projects = getLocalProjects(locale);
  const demo = projects.find((p) => p.slug === DEMO);
  if (!demo) throw new Error(`portfolio.json: the home page demo "${DEMO}" is missing`);

  return (
    <>
      <SiteJsonLd locale={locale} />
      <Hero site={site} />
      <Journey copy={bail} />
      <Showcase site={site} project={demo} estimator={bail.details.estimator} />
      <AiSection site={site} />
      <Products site={site} />
      <Process site={site} compact />
      <WhyTrace site={site} />
      <Faq id="home-faq-title" title={site.faq.title} items={bail.faq.items} />
      <ContactBand site={site} locale={locale} context={site.meta.title} services={bail.cta.services} />
    </>
  );
}
