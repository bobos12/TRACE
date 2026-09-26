import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getLocalProjects, getLocalServices, getSite, toCardData } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { ContactBand } from '@/components/sections/ContactBand';
import { Constellation } from '@/components/brand/Constellation';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import { WhatsAppButton } from '@/components/contact/ContactButtons';
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
    path: '/work',
    title: site.pages.work.title.replace(/\.$/, ''),
    description: site.pages.work.lead,
  });
}

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const query = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? 'all';

  const site = getSite(locale);
  const projects = getLocalProjects(locale);
  const services = getLocalServices(locale);
  const copy = site.pages.work;

  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: site.work.cta, path: '/work' }]} />

      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={
          <ul className="grid grid-cols-3 gap-x-10 gap-y-8">
            {projects.slice(0, 6).map((p) => (
              <li key={p.slug} className="flex justify-center">
                <Constellation seed={p.client} size={14} quiet className="text-ink" />
              </li>
            ))}
          </ul>
        }
      />

      <WorkIndex
        ui={site.ui}
        projects={projects.map(toCardData)}
        services={services.map((s) => ({ slug: s.slug, title: s.title }))}
        initial={{
          kind: one(query.kind),
          service: one(query.service),
          sector: one(query.sector),
        }}
      />

      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="flex flex-col items-start gap-6">
          <Reveal as="h2" className="display-md">
            <StopText>{copy.endTitle}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.05} className="body-lg max-w-[48ch] text-ink-muted">
            {copy.endText}
          </Reveal>
          <Reveal delay={0.1}>
            <WhatsAppButton placement="work" context={copy.endTitle} size="lg">
              {site.cta.whatsapp}
            </WhatsAppButton>
          </Reveal>
        </Container>
      </section>

      <ContactBand site={site} locale={locale} context={copy.title} />
    </>
  );
}
