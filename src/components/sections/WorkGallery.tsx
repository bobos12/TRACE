import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Constellation } from '@/components/brand/Constellation';
import { StopText } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import { LinkButton } from '@/components/ui/LinkButton';
import { BookingLink } from '@/components/contact/BookingLink';
import { ProjectBadges } from '@/components/sections/ProjectMeta';
import type { LocalProject, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

function Card({
  project,
  site,
  eager,
  /** Cover beside the text from `lg` up. */
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
            {project.client} ◆ {project.sector}
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
 * Selected work: the featured projects stacked as large case cards — cover
 * beside the story on desktop, cover above it on phones. Each rises in once as
 * it enters view; nothing scrolls sideways.
 */
export function WorkGallery({ site, projects }: { site: Site; projects: LocalProject[] }) {
  return (
    <section id="work" className="border-b border-line bg-surface">
      <Container className="pt-[var(--section-y)] pb-14">
        <SectionHead eyebrow={site.work.eyebrow} title={<StopText>{site.work.title}</StopText>} />
      </Container>

      <Container>
        <ul className="flex flex-col gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal="rise" style={{ '--d': `${(i % 2) * 60}ms` } as CSSProperties}>
              <Card project={p} site={site} eager={i === 0} wide />
            </li>
          ))}
        </ul>
      </Container>

      <Container className="flex flex-col items-start gap-5 pt-14 pb-[var(--section-y)] sm:flex-row sm:items-center sm:justify-between">
        <LinkButton href="/work" variant="secondary" iconEnd="arrow-right">
          {site.work.cta}
        </LinkButton>
        <BookingLink placement="work">{site.ui.workAsk}</BookingLink>
      </Container>
    </section>
  );
}

export default WorkGallery;
