import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Reveal } from '@/components/motion/Reveal';
import { metaLine } from '@/components/sections/ProjectMeta';
import { projectCategories } from '@/lib/kinds';
import type { LocalProject, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

const two = (n: number) => String(n).padStart(2, '0');

const arrow =
  'flex-none text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/row:translate-x-1 group-hover/row:text-ink';

/**
 * Client work, as relationships rather than a grid of equals.
 *
 * One client with several delivered projects is stronger proof than several
 * one-offs, so the group leads: the client's mark, what we built for them,
 * and every project linking to its case study. The rest of the client work
 * follows grouped by what was built, as small tiles.
 */
export function ClientWork({
  site,
  group,
  more,
}: {
  site: Site;
  group: LocalProject[];
  more: LocalProject[];
}) {
  const copy = site.clientWork;
  const [lead, ...rest] = group;
  const groups = projectCategories
    .map((category) => ({ category, projects: more.filter((p) => p.category === category) }))
    .filter((g) => g.projects.length > 0);

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-14">
        <SectionHead
          eyebrow={copy.eyebrow}
          title={<StopText>{copy.title}</StopText>}
          lead={copy.lead}
        />

        {lead ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            {/* The main website carries the section — large, with the cut. */}
            <Reveal className="lg:col-span-7">
              <Link href={`/work/${lead.slug}`} className="group/row flex flex-col gap-5">
                <figure
                  className="at-cut relative aspect-[16/10] w-full overflow-hidden bg-carbon"
                  style={{ '--cut': '28px' } as CSSProperties}
                >
                  <Image
                    src={lead.cover}
                    alt={lead.title}
                    fill
                    sizes="(max-width: 1440px) 92vw, 700px"
                    className="object-cover transition-transform duration-[600ms] ease-mark group-hover/row:scale-[1.03]"
                  />
                </figure>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="eyebrow text-ink-faint">{two(1)}</span>
                    <h3 className="heading-2 m-0 max-w-[28ch]">{lead.title}</h3>
                    <p className="body-sm max-w-[52ch] text-ink-muted">{lead.summary}</p>
                  </div>
                  <Icon name="arrow-right" size={20} className={cn(arrow, 'mt-7')} />
                </div>
              </Link>
            </Reveal>

            <div className="flex flex-col lg:col-span-5">
              <p className="eyebrow border-b border-line pb-4 text-ink-muted">
                {copy.projectsLabel}
              </p>
              <ul className="flex flex-col">
                {rest.map((p, i) => (
                  <li
                    key={p.slug}
                    data-reveal="rise"
                    style={{ '--d': `${(i + 1) * 70}ms` } as CSSProperties}
                    className="border-b border-line"
                  >
                    <Link
                      href={`/work/${p.slug}`}
                      className="group/row grid grid-cols-[7.5rem_1fr_auto] items-center gap-5 py-5 sm:grid-cols-[10rem_1fr_auto]"
                    >
                      <span className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-carbon">
                        <Image
                          src={p.cover}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover transition-transform duration-[600ms] ease-mark group-hover/row:scale-[1.04]"
                        />
                      </span>
                      <span className="flex flex-col gap-1.5">
                        <span className="eyebrow text-ink-faint">{two(i + 2)}</span>
                        <span className="heading-3">{p.title}</span>
                      </span>
                      <Icon name="arrow-right" size={18} className={arrow} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {groups.length ? (
          <div className="flex flex-col gap-12 pt-6 md:gap-16">
            <Reveal as="h3" className="heading-2 m-0">
              {copy.moreTitle}
            </Reveal>

            {/* Grouped by what was built, so an owner finds work like theirs. */}
            {groups.map(({ category, projects }) => (
              <div key={category} className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-8">
                <Reveal as="h4" className="eyebrow m-0 flex items-center gap-2.5 self-start text-ink-muted md:col-span-3 md:pt-1">
                  <Nuqta size={7} tone="muted" />
                  {copy.categories[category]}
                </Reveal>
                <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 md:col-span-9 md:gap-x-6 [&::-webkit-scrollbar]:hidden">
                  {projects.map((p, i) => (
                    <li
                      key={p.slug}
                      data-reveal="rise"
                      style={{ '--d': `${i * 60}ms` } as CSSProperties}
                      className="w-[64%] flex-none snap-start sm:w-auto"
                    >
                      <Link href={`/work/${p.slug}`} className="group/row flex flex-col gap-3">
                        <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-sm bg-carbon">
                          <Image
                            src={p.cover}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 300px"
                            className="object-cover transition-transform duration-[600ms] ease-mark group-hover/row:scale-[1.04]"
                          />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-2 text-[15px] font-medium text-ink">
                            {p.client}
                            <Icon
                              name="arrow-right"
                              size={14}
                              className="text-ink-faint opacity-0 transition-[opacity,translate] duration-[160ms] ease-mark group-hover/row:translate-x-0.5 group-hover/row:opacity-100"
                            />
                          </span>
                          <span className="body-sm text-ink-faint">{metaLine(p)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default ClientWork;
