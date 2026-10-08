import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { readLocale, routing } from '@/i18n/routing';
import {
  getClientLogos,
  getFeaturedProjects,
  getLocalServices,
  getPlatforms,
  getSite,
  localizeProject,
} from '@/lib/content';

import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { ServicesBento } from '@/components/sections/ServicesBento';
import { WorkGallery } from '@/components/sections/WorkGallery';
import { Platforms } from '@/components/sections/Platforms';
import { Process } from '@/components/sections/Process';
import { WhyTrace } from '@/components/sections/WhyTrace';
import { ContactBand } from '@/components/sections/ContactBand';
import { SiteJsonLd } from '@/components/seo/SiteJsonLd';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata({ locale: readLocale((await params).locale), path: '/' });
}

/**
 * Proof first. Who we are (hero), who we have built for (real logos) and what
 * every client gets in writing, what we have built (selected work), then what
 * we can build and what it runs on — then process, and why to trust us with it.
 * English throughout: projects whose screens are Arabic live on /work only.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const services = getLocalServices(locale);
  const featured = getFeaturedProjects();
  const projects = featured.map((p) => localizeProject(p, locale));

  return (
    <>
      <SiteJsonLd locale={locale} />
      <Hero site={site} />
      <TrustStrip site={site} clients={getClientLogos(locale)} />
      <WorkGallery site={site} projects={projects} />
      <ServicesBento site={site} services={services} />
      <Platforms site={site} platforms={getPlatforms(locale)} />
      <Process site={site} />
      <WhyTrace site={site} />
      <ContactBand site={site} locale={locale} context={site.meta.title} />
    </>
  );
}
