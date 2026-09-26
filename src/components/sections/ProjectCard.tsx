import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Constellation } from '@/components/brand/Constellation';
import { Icon } from '@/components/ui/Icon';
import { ProjectBadges, metaLine } from '@/components/sections/ProjectMeta';
import type { ProjectCardData, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * The portfolio grid card. On hover the cover scales 1.00 → 1.03, an overlay
 * slides up with "View project →", and the project's constellation lights up.
 *
 * Under the title: the numbers where a project has verified ones, and what it
 * actually does where it does not. Never both, never an empty row.
 *
 * Entrance is the shared CSS reveal, not the animation library.
 *
 * No cover is ever `priority`. The work index's LCP is the hero paragraph,
 * and preloading a below-the-fold cover alongside it cost 480ms of LCP and
 * seven Lighthouse points. Every cover is lazy. See DECISIONS.md.
 */
export function ProjectCard({
  project,
  ui,
  index = 0,
  /** The lead cards on the work index: cover beside the copy, not above it. */
  wide = false,
  /** 2 under a page heading, 3 under a section heading — keeps the outline valid. */
  headingLevel = 2,
  className,
}: {
  project: ProjectCardData;
  ui: Site['ui'];
  index?: number;
  wide?: boolean;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <article
      data-reveal="rise"
      style={{ '--d': `${Math.min(index, 5) * 60}ms` } as CSSProperties}
      className={cn('group/card flex flex-col gap-5', className)}
    >
      <Link
        href={`/work/${project.slug}`}
        className={cn(
          'flex flex-col gap-5',
          wide && 'md:grid md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10',
        )}
      >
        <figure className="relative aspect-[16/10] w-full overflow-hidden bg-carbon group-hover/card:at-cut">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes={wide ? '(max-width: 768px) 92vw, 60vw' : '(max-width: 768px) 92vw, 46vw'}
            className="object-cover transition-transform duration-[600ms] ease-mark group-hover/card:scale-[1.03]"
          />
          {/* The overlay slides up on hover; keyboard focus shows it too. */}
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2 bg-carbon/95 px-5 py-4 text-[14px] font-medium text-paper transition-transform duration-[260ms] ease-mark group-hover/card:translate-y-0 group-focus-within/card:translate-y-0">
            {ui.viewProject}
            <Icon name="arrow-right" size={16} />
          </figcaption>
        </figure>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="eyebrow flex flex-wrap items-center gap-2 text-ink-faint">
                {project.client} ◆ {metaLine(project)}
                <ProjectBadges project={project} ui={ui} />
              </span>
              <Heading className={wide ? 'display-md' : 'heading-1'}>{project.title}</Heading>
            </div>
            <Constellation
              seed={project.client}
              size={wide ? 13 : 11}
              className="mt-1 flex-none text-ink-faint transition-colors duration-[260ms] group-hover/card:text-ink"
            />
          </div>

          {project.results.length ? (
            <dl className="flex flex-wrap gap-x-10 gap-y-3">
              {project.results.slice(0, 2).map((r) => (
                <div key={r.label} className="flex flex-col">
                  <dd className="font-mono text-[24px] font-medium leading-none tracking-[-0.02em]">
                    {r.value}
                  </dd>
                  <dt className="mt-1.5 text-[12px] text-ink-muted">{r.label}</dt>
                </div>
              ))}
            </dl>
          ) : project.capabilities.length ? (
            <ul className="flex flex-wrap gap-2">
              {project.capabilities.map((c) => (
                <li
                  key={c}
                  className="inline-flex h-8 items-center rounded-sm border border-line px-3 text-[13px] text-ink-muted transition-colors duration-[260ms] group-hover/card:border-line-strong"
                >
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export default ProjectCard;
