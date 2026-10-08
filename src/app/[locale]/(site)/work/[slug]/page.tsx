import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { readLocale, routing } from '@/i18n/routing';
import {
  getClientLogos,
  getNextProject,
  getProject,
  getProjects,
  getService,
  getSite,
  localizeProject,
} from '@/lib/content';
import { jsonLd as toJsonLd, pageMetadata, siteUrl } from '@/lib/seo';
import { organizationRef } from '@/lib/structured-data';

import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Constellation } from '@/components/brand/Constellation';
import { ClientMark } from '@/components/sections/ClientMark';
import { ContactBand } from '@/components/sections/ContactBand';
import { ProjectCover } from '@/components/sections/ProjectCover';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { ProjectBadges, kindLabel, metaLine } from '@/components/sections/ProjectMeta';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects().map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = readLocale(rawLocale);
  const project = getProject(slug);
  if (!project) return {};
  const copy = project[locale];

  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${copy.client} — ${copy.title}`,
    description: copy.summary,
    // Rendered by src/app/og/work/[slug]/route.tsx.
    image: `/og/work/${slug}`,
    type: 'article',
    // Sample projects stay reachable from /work but out of search results.
    noindex: project.placeholder,
  });
}

const RESULT_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="eyebrow text-ink-faint">{label}</dt>
      <dd className="body-sm text-ink">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = readLocale(rawLocale);
  setRequestLocale(locale);

  const found = getProject(slug);
  if (!found) notFound();

  const site = getSite(locale);
  const ui = site.ui;
  const project = localizeProject(found, locale);
  // The client's own logo, when we have it — shared across a client's projects.
  const clientLogo = getClientLogos(locale).find((logo) => {
    if (!logo.href) return false;
    const owner = getProject(logo.href.split('/').pop() ?? '');
    return owner?.slug === slug || (found.group !== undefined && owner?.group === found.group);
  });
  const next = getNextProject(slug);
  const nextProject = next ? localizeProject(next, locale) : undefined;

  const serviceNames = project.services
    .map((s) => getService(s)?.[locale].title)
    .filter((s): s is string => Boolean(s));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: `${project.client} — ${project.title}`,
    abstract: project.summary,
    inLanguage: locale,
    dateCreated: String(project.year),
    url: siteUrl(`/work/${slug}`),
    image: siteUrl(project.cover),
    creator: organizationRef(),
    about: serviceNames.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
      />
      <Breadcrumbs
        trail={[
          { name: site.work.cta, path: '/work' },
          { name: project.title, path: `/work/${slug}` },
        ]}
      />

      {/* 1 · Hero on a graphite band. */}
      <header className="band-graphite pt-32 pb-16 md:pb-20">
        <Container className="flex flex-col gap-16">
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col gap-6">
              <p className="eyebrow flex flex-wrap items-center gap-2 text-ink-muted">
                {ui.caseStudy} ◆ {metaLine(project)}
                <ProjectBadges project={project} ui={ui} tone="outline" />
              </p>
              <h1 className="display-xl m-0 max-w-[14ch]">
                <StopText>{project.client}</StopText>
              </h1>
              <p className="heading-2 max-w-[32ch] text-ink-muted">{project.title}</p>

              {/* Said plainly, at the top, before anything else is read. */}
              {project.kind === 'concept' ? (
                <p className="body-sm flex max-w-[54ch] gap-3 border-s-2 border-vermilion ps-4 text-ink-muted">
                  {ui.conceptNote}
                </p>
              ) : null}

              {project.links.live || project.links.source || project.links.demo ? (
                <div className="flex flex-wrap gap-3">
                  {project.links.live ? (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClasses({ variant: 'secondary', size: 'md' })}
                    >
                      <span>{ui.visitSite}</span>
                      <Icon name="arrow-up-right" size={18} className="rtl:-scale-x-100" />
                    </a>
                  ) : null}
                  {project.links.demo ? (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClasses({ variant: 'secondary', size: 'md' })}
                    >
                      <span>{ui.viewDemo}</span>
                      <Icon name="arrow-up-right" size={18} className="rtl:-scale-x-100" />
                    </a>
                  ) : null}
                  {project.links.source ? (
                    <a
                      href={project.links.source}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClasses({ variant: 'ghost', size: 'md' })}
                    >
                      <Icon name="code" size={18} />
                      <span>{ui.viewCode}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
            {/* Wrapped, because `hidden` on the component itself loses to the
                `inline-grid` it sets for the lattice. */}
            <span className="hidden flex-none sm:block">
              <Constellation seed={project.client} size={20} className="text-ink" />
            </span>
          </div>

          {/* Columns follow the number of results, so the row never ends in an
              empty cell. */}
          {project.results.length ? (
            <dl className={`grid grid-cols-2 border-t border-line ${RESULT_COLS[Math.min(project.results.length, 4)] ?? 'md:grid-cols-4'}`}>
              {project.results.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex flex-col gap-1.5 py-6 pe-6 ${i > 0 ? 'md:border-s md:border-line md:ps-6' : ''}`}
                >
                  <dd className="font-mono text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-medium leading-none tracking-[-0.04em]">
                    <CountUp value={r.value} />
                  </dd>
                  <dt className="body-sm text-ink-muted">{r.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </header>

      {/* 2 · The cover, across the seam between the band and the page. */}
      <ProjectCover src={project.cover} alt={`${project.client} — ${project.title}`} />

      {/* 3 · Facts sidebar + body. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <dl className="flex flex-col gap-6 lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <Fact label={kindLabel(project.kind, ui)}>
              {[project.client, project.country].filter(Boolean).join(', ')}
            </Fact>
            {serviceNames.length ? (
              <Fact label={ui.servicesLabel}>{serviceNames.join(' · ')}</Fact>
            ) : null}
            {project.stack.length ? (
              <Fact label={ui.stack}>
                {/* Framework names are Latin; keep them in the Latin face even
                    in an RTL page, per docs/brand-guidelines/06-typography.md. */}
                <span lang="en" className="font-sans">
                  {project.stack.join(', ')}
                </span>
              </Fact>
            ) : null}
            {project.capabilities.length ? (
              <Fact label={ui.capabilities}>{project.capabilities.join(' · ')}</Fact>
            ) : null}
            {project.year ? <Fact label={ui.year}>{project.year}</Fact> : null}
            <div className="flex flex-col gap-2">
              <dt className="eyebrow text-ink-faint">{ui.theirMark}</dt>
              <dd>
                {clientLogo ? (
                  <ClientMark client={clientLogo} className="h-10 w-auto max-w-[180px]" />
                ) : (
                  <Constellation seed={project.client} size={13} className="text-ink" />
                )}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-12 lg:col-span-8 lg:col-start-5">
            {project.challenge ? (
              <Reveal as="section" className="flex flex-col gap-4">
                <p className="eyebrow text-ink-muted">01 ◆ {ui.challenge}</p>
                <h2 className="display-md">{ui.challenge}</h2>
                <p className="body-lg max-w-[62ch] text-ink-muted">{project.challenge}</p>
              </Reveal>
            ) : null}

            {project.solution ? (
              <Reveal as="section" className="flex flex-col gap-4">
                <p className="eyebrow text-ink-muted">02 ◆ {ui.whatWeDid}</p>
                <h2 className="display-md">{ui.whatWeDid}</h2>
                <p className="body-lg max-w-[62ch] text-ink-muted">{project.solution}</p>
              </Reveal>
            ) : null}

            {project.results.length ? (
              <Reveal as="section" className="flex flex-col gap-4">
                <p className="eyebrow text-ink-muted">03 ◆ {ui.results}</p>
                <h2 className="display-md">{ui.results}</h2>
                <ul className="border-t border-line">
                  {project.results.map((r) => (
                    <li key={r.label} className="flex items-baseline gap-4 border-b border-line py-4">
                      <Nuqta size={9} />
                      <b className="font-mono text-[18px] font-medium">{r.value}</b>
                      <span className="body text-ink-muted">{r.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {project.quote ? (
              <Reveal as="figure" className="flex flex-col gap-5 border-t border-line pt-10">
                <blockquote className="display-md flex gap-4">
                  <Nuqta size={13} className="mt-[0.5em] flex-none" />
                  <p>{project.quote.text}</p>
                </blockquote>
                <figcaption className="body-sm ps-9 text-ink-muted">{project.quote.by}</figcaption>
              </Reveal>
            ) : null}
          </div>
        </Container>

        {/* 4 · The gallery gets the full measure — the images are the proof. */}
        {project.gallery.length ? (
          <Container className="mt-[var(--section-y)] flex flex-col gap-8">
            <h2 className="eyebrow text-ink-muted">{ui.gallery}</h2>
            <ProjectGallery
              images={project.gallery}
              title={project.title}
              labels={{
                gallery: ui.gallery,
                close: ui.close,
                previous: ui.previous,
                next: ui.next,
              }}
            />
          </Container>
        ) : null}
      </section>

      {/* 6 · Next project. */}
      {nextProject ? (
        <section className="border-b border-line bg-surface">
          <Link
            href={`/work/${nextProject.slug}`}
            className="group/next block transition-colors duration-[160ms] ease-mark hover:bg-surface-raised"
          >
            <Container className="grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-12">
              <div className="flex flex-col gap-3 md:col-span-6">
                <span className="eyebrow text-ink-faint">{ui.nextProject}</span>
                <h2 className="display-md flex items-center gap-3">
                  {nextProject.client}
                  <Icon
                    name="arrow-right"
                    size={24}
                    className="text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/next:translate-x-1.5 rtl:group-hover/next:-translate-x-1.5"
                  />
                </h2>
                <p className="body text-ink-muted">{nextProject.title}</p>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-carbon md:col-span-5 md:col-start-8">
                <Image
                  src={nextProject.cover}
                  alt={nextProject.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 40vw"
                  className="object-cover transition-transform duration-[600ms] ease-mark group-hover/next:scale-[1.03]"
                />
              </div>
            </Container>
          </Link>
        </section>
      ) : null}

      <ContactBand site={site} locale={locale} context={`${ui.client}: ${project.client}`} />
    </>
  );
}
