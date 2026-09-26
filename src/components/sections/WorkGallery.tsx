'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Constellation } from '@/components/brand/Constellation';
import { StopText } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import { LinkButton } from '@/components/ui/LinkButton';
import { WhatsAppLink } from '@/components/contact/WhatsAppLink';
import { ProjectBadges, metaLine } from '@/components/sections/ProjectMeta';
import type { LocalProject, Site } from '@/lib/content';
import { useScrollProgress } from '@/lib/scroll';
import { cn } from '@/lib/cn';

function Card({
  project,
  site,
  eager,
  /** Two columns — only wide enough to work on the pinned desktop track. */
  wide = false,
}: {
  project: LocalProject;
  site: Site;
  eager: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        // Compact on phones — the carousel card should not outgrow the screen.
        'group/case grid h-full w-full grid-cols-1 gap-4 bg-graphite p-4 text-paper sm:gap-6 sm:p-8',
        wide && 'lg:grid-cols-[1.45fr_1fr] lg:items-center lg:gap-10 lg:p-9',
      )}
    >
      {/* The cover keeps its exact 16:10 ratio so the device mockups are never
          cropped; the card is sized around it. It carries the cut. */}
      <figure
        className="at-cut relative aspect-[16/10] w-full overflow-hidden bg-carbon"
        style={{ '--cut': '28px' } as CSSProperties}
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes={wide ? '(max-width: 1024px) 88vw, 42vw' : '(max-width: 640px) 88vw, 540px'}
          loading={eager ? 'eager' : 'lazy'}
          className="object-cover transition-transform duration-[600ms] ease-mark group-hover/case:scale-[1.03]"
        />
      </figure>

      <div className="flex h-full flex-col justify-between gap-4 sm:gap-7">
        <div className="flex items-start justify-between gap-6">
          <span className="eyebrow flex flex-wrap items-center gap-2 opacity-75">
            {project.client} ◆ {metaLine(project)}
            <ProjectBadges project={project} ui={site.ui} tone="outline" />
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:gap-7">
          {/* The client's constellation sits beside the title it marks. */}
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn('max-w-[15ch]', wide ? 'display-md' : 'heading-1')}>
              {project.title}
            </h3>
            <Constellation seed={project.client} size={13} quiet className="mt-1.5 flex-none text-paper" />
          </div>

          {/* Numbers where a project has verified ones; what it does where it
              does not. A project with neither simply shows neither. */}
          {project.results.length ? (
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {project.results.slice(0, 2).map((r) => (
                <div key={r.label} className="flex flex-col">
                  <b className="font-mono text-[clamp(1.75rem,1.2rem+1.4vw,2.375rem)] font-medium leading-none tracking-[-0.03em]">
                    {r.value}
                  </b>
                  <span className="mt-1.5 block max-w-[18ch] text-[12px] opacity-70">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          ) : project.capabilities.length ? (
            // Hidden on phones: the title already says what it is.
            <ul className="hidden flex-wrap gap-2 sm:flex">
              {project.capabilities.map((c) => (
                <li
                  key={c}
                  className="inline-flex h-8 items-center rounded-sm px-3 text-[13px] opacity-90 shadow-[inset_0_0_0_1px_var(--line-strong)]"
                >
                  {c}
                </li>
              ))}
            </ul>
          ) : null}

          <span className="flex items-center gap-2 text-[14px] font-medium">
            {site.work.caseCta}
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-[160ms] ease-mark group-hover/case:translate-x-1 rtl:group-hover/case:-translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * The pinned track.
 *
 * A sticky viewport whose horizontal position follows vertical scroll. This is
 * not scroll-jacking — the page scrolls natively and the position is simply
 * mapped to translateX by one CSS custom property that `useScrollProgress`
 * writes. A progress trace runs underneath with one nuqta per project.
 */
function PinnedTrack({
  site,
  projects,
  rtl,
}: {
  site: Site;
  projects: LocalProject[];
  rtl: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const nuqtas = useRef<HTMLSpanElement>(null);

  // A card is 76vw with a 4vw gap; the track travels the overflow. In RTL the
  // flow is already right-to-left, so the travel sign flips.
  const travel = Math.max(0, projects.length * 80 - 100);

  const markCurrent = useCallback(
    (progress: number) => {
      const list = nuqtas.current;
      if (!list) return;
      const index = Math.round(progress * (projects.length - 1));
      for (let i = 0; i < list.children.length; i += 1) {
        const dot = list.children[i] as HTMLElement;
        if (i === index) dot.setAttribute('data-current', '');
        else dot.removeAttribute('data-current');
      }
    },
    [projects.length],
  );

  useScrollProgress(ref, { offset: 'contain', onProgress: markCurrent });

  return (
    <div ref={ref} style={{ height: `${projects.length * 95}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden pt-16">
        <div
          className="at-work-track flex gap-[4vw] ps-[4vw] pe-[20vw]"
          style={{ '--travel': `${rtl ? '' : '-'}${travel}vw` } as CSSProperties}
        >
          {projects.map((p, i) => (
            <div key={p.slug} className="h-[56vh] max-h-[540px] min-h-[420px] w-[76vw] flex-none">
              <Card project={p} site={site} eager={i === 0} wide />
            </div>
          ))}
        </div>

        <div className="container-page">
          <div className="relative h-px w-full bg-line">
            <span aria-hidden="true" className="at-work-progress absolute inset-0 bg-ink" />
            <span
              ref={nuqtas}
              aria-hidden="true"
              className="absolute inset-x-0 -top-1.5 flex justify-between"
            >
              {projects.map((p, i) => (
                <span
                  key={p.slug}
                  data-current={i === 0 ? '' : undefined}
                  className="at-work-nuqta size-2.5 bg-vermilion"
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Selected work.
 *
 * Desktop: the pinned horizontal track above.
 * Below 1024px: a scroll-snap carousel.
 * Under prefers-reduced-motion: a plain vertical list, per docs/05-motion.md.
 */
export function WorkGallery({
  site,
  projects,
  rtl,
}: {
  site: Site;
  projects: LocalProject[];
  rtl: boolean;
}) {
  const [mode, setMode] = useState<'list' | 'carousel' | 'pinned'>('carousel');

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMode(still.matches ? 'list' : wide.matches ? 'pinned' : 'carousel');
    apply();
    wide.addEventListener('change', apply);
    still.addEventListener('change', apply);
    return () => {
      wide.removeEventListener('change', apply);
      still.removeEventListener('change', apply);
    };
  }, []);

  return (
    <section id="work" className="border-b border-line bg-surface">
      <Container className="pt-[var(--section-y)] pb-14">
        <SectionHead eyebrow={site.work.eyebrow} title={<StopText>{site.work.title}</StopText>} />
      </Container>

      {mode === 'pinned' ? (
        <PinnedTrack site={site} projects={projects} rtl={rtl} />
      ) : mode === 'list' ? (
        <Container>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Card project={p} site={site} eager={i === 0} />
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              data-reveal="rise"
              style={{ '--d': `${i * 60}ms` } as CSSProperties}
              className="w-[86vw] max-w-[540px] flex-none snap-center"
            >
              <Card project={p} site={site} eager={i === 0} />
            </li>
          ))}
        </ul>
      )}

      <Container className="flex flex-col items-start gap-5 pt-14 pb-[var(--section-y)] sm:flex-row sm:items-center sm:justify-between">
        <LinkButton href="/work" variant="secondary" iconEnd="arrow-right">
          {site.work.cta}
        </LinkButton>
        <WhatsAppLink placement="work" context={site.work.title}>
          {site.ui.workAsk}
        </WhatsAppLink>
      </Container>
    </section>
  );
}

export default WorkGallery;
