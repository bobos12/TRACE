import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getLocalServices, getSite } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceRows } from '@/components/sections/ServiceRows';
import { ContactBand } from '@/components/sections/ContactBand';
import { BreathingNuqtas } from '@/components/brand/BreathingNuqtas';
import { BookingLink } from '@/components/contact/BookingLink';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

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
    path: '/services',
    title: site.pages.services.seo.title,
    description: site.pages.services.seo.description,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const services = getLocalServices(locale);
  const copy = site.pages.services;

  return (
    <>
      <Breadcrumbs
        trail={[{ name: site.nav.links[1]?.label ?? copy.title, path: '/services' }]}
      />

      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={<BreathingNuqtas className="w-40 text-ink md:w-56" />}
      />

      <section className="bg-surface py-[var(--section-y)]">
        <Container className="flex flex-col gap-14">
          <ServiceRows services={services} />
          <div className="flex justify-center">
            <BookingLink placement="services">{copy.midCta}</BookingLink>
          </div>
        </Container>
      </section>

      <ContactBand site={site} locale={locale} context={copy.title} />
    </>
  );
}
