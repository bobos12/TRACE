import { setRequestLocale } from 'next-intl/server';
import { readLocale, routing } from '@/i18n/routing';
import {
  getClientLogos,
  getFeaturedProjects,
  getLocalServices,
  getPlatforms,
  getProjectsByGroup,
  getProjectsByKind,
  getSite,
  localizeProject,
} from '@/lib/content';

import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { ServicesBento } from '@/components/sections/ServicesBento';
import { WorkGallery } from '@/components/sections/WorkGallery';
import { Platforms } from '@/components/sections/Platforms';
import { ClientWork } from '@/components/sections/ClientWork';
import { Process } from '@/components/sections/Process';
import { ContactBand } from '@/components/sections/ContactBand';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** The client whose several projects lead the client-work section. */
const LEAD_GROUP = 'fateen';

/**
 * Proof first. Who we are (hero), who we have built for (real logos), what we
 * have built (selected work), then what we can build, what it runs on, and the
 * client relationships behind it — before a word about process.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const services = getLocalServices(locale);
  const featured = getFeaturedProjects();
  const projects = featured.map((p) => localizeProject(p, locale));
  const clients = getClientLogos(locale);

  const group = getProjectsByGroup(LEAD_GROUP).map((p) => localizeProject(p, locale));
  // Real client work not already shown above — never a concept.
  const more = getProjectsByKind('client')
    .filter((p) => !p.featured && p.group !== LEAD_GROUP)
    .map((p) => localizeProject(p, locale));

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <Hero site={site} locale={locale} />
      <TrustStrip site={site} clients={clients} />
      <WorkGallery site={site} projects={projects} rtl={locale === 'ar'} />
      <ServicesBento site={site} services={services} />
      <Platforms site={site} platforms={getPlatforms(locale)} />
      <ClientWork
        site={site}
        locale={locale}
        group={group}
        more={more}
      />
      <Process site={site} />
      <ContactBand site={site} locale={locale} context={site.meta.title} />
    </>
  );
}
