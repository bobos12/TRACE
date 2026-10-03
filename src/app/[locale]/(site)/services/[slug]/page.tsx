import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import {
  getService,
  getServices,
  getProjectsByService,
  getSite,
  localizeProject,
  localizeService,
} from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { ContactBand } from '@/components/sections/ContactBand';
import { Process } from '@/components/sections/Process';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ServiceIllustration } from '@/components/illustrations/ServiceIllustrations';
import { Accordion } from '@/components/ui/Accordion';
import { Nuqta } from '@/components/brand/Nuqta';
import { Reveal } from '@/components/motion/Reveal';
import { BookCallButton, EmailButton } from '@/components/contact/ContactButtons';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getServices().map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = readLocale(rawLocale);
  const service = getService(slug);
  if (!service) return {};
  const copy = service[locale];

  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: copy.title,
    description: copy.line,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = readLocale(rawLocale);
  setRequestLocale(locale);

  const found = getService(slug);
  if (!found) notFound();

  const site = getSite(locale);
  const service = localizeService(found, locale);
  const copy = site.pages.serviceDetail;
  const related = getProjectsByService(slug).map((p) => localizeProject(p, locale));

  return (
    <>
      <Breadcrumbs
        trail={[
          { name: site.services.cta, path: '/services' },
          { name: service.title, path: `/services/${slug}` },
        ]}
      />

      <PageHero
        eyebrow={`${copy.eyebrow} ◆ ${String(service.index + 1).padStart(2, '0')}`}
        title={service.title}
        lead={service.line}
        aside={
          <div className="w-full max-w-[380px] text-ink">
            <ServiceIllustration visual={service.visual} />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <BookCallButton placement={`service:${slug}`} size="lg">
            {site.hero.primaryCta}
          </BookCallButton>
          <EmailButton
            placement={`service:${slug}`}
            subject={site.services.requestMessage.replace('{service}', service.title)}
            size="lg"
          >
            {site.cta.email}
          </EmailButton>
        </div>
      </PageHero>

      {/* What you get — a ruled list with nuqta bullets. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal as="h2" className="heading-1 lg:col-span-4">
            {copy.deliverablesTitle}
          </Reveal>
          <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
            {service.deliverables.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={i * 0.05}
                className="flex items-baseline gap-4 border-b border-line py-5"
              >
                <Nuqta size={9} className="translate-y-[-2px]" />
                <span className="body-lg">{item}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <Process site={site} />

      {related.length ? (
        <section className="border-b border-line bg-surface py-[var(--section-y)]">
          <Container className="flex flex-col gap-12">
            <Reveal as="h2" className="display-md">
              {site.ui.relatedWork}
            </Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
              {related.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i}
                  ui={site.ui}
                  headingLevel={3}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal as="h2" className="heading-1 lg:col-span-4">
            {copy.faqTitle}
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion items={copy.faq} />
          </div>
        </Container>
      </section>

      <ContactBand site={site} locale={locale} context={service.title} />
    </>
  );
}
