import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Browser } from '@/components/bail/Frames';
import { buttonClasses } from '@/components/ui/buttonStyles';
import type { LocalProject, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

type Demos = Site['pages']['work']['demos'];

/**
 * The live demos, before the index. Each is a panel: the site in
 * a browser with its phone over the corner, in the same stage for every demo,
 * then what it is, what it does and the button that opens it. On wide screens
 * the panels share a subgrid, so labels, titles, lists and buttons sit on one
 * line across all three; on tablets each panel turns sideways.
 */
export function WorkDemos({ copy, projects }: { copy: Demos; projects: LocalProject[] }) {
  const demos = copy.items.flatMap((item) => {
    const project = projects.find((p) => p.slug === item.slug);
    return project?.links.demo ? [{ item, project, href: project.links.demo }] : [];
  });
  if (!demos.length) return null;

  return (
    <section className="band-carbon border-b border-line bg-surface pt-12 pb-[var(--section-y)] text-ink md:pt-14" aria-labelledby="work-demos-title">
      <Container className="flex flex-col gap-8 md:gap-10">
        <SectionHead title={<span id="work-demos-title"><StopText>{copy.title}</StopText></span>} lead={copy.lead} size="md" />

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          {demos.map(({ item, project, href }, i) => (
            <Reveal
              as="li"
              key={item.slug}
              delay={i * 0.08}
              className={cn(
                'group/card relative flex flex-col overflow-hidden rounded-md bg-surface-raised ring-1 ring-line transition-[box-shadow] duration-[300ms] ease-mark hover:shadow-float hover:ring-line-strong',
                'sm:max-md:grid sm:max-md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]',
                'md:row-span-5 md:grid md:grid-rows-subgrid md:gap-0',
              )}
            >
              {/* The stage: identical for every demo. */}
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${copy.open} — ${project.client}`}
                className="relative block aspect-[16/11] overflow-hidden border-b border-line bg-surface-sunken sm:max-md:row-span-4 sm:max-md:aspect-auto sm:max-md:h-full sm:max-md:min-h-[300px] sm:max-md:border-e sm:max-md:border-b-0"
              >
                <span className="absolute inset-x-[7%] top-[11%] bottom-[13%] pe-[16%]">
                  <Browser url={item.url} className="transition-transform duration-[600ms] ease-mark group-hover/card:-translate-y-1">
                    <span className="relative block aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={item.desktop}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 360px"
                        className="object-cover object-top"
                      />
                    </span>
                  </Browser>
                </span>
                <span className="absolute end-[6%] bottom-[7%] w-[23%] overflow-hidden rounded-[18px] bg-surface p-1 shadow-float ring-1 ring-line-strong transition-transform duration-[600ms] ease-mark group-hover/card:-translate-y-2">
                  <span className="relative block aspect-[390/844] overflow-hidden rounded-[14px]">
                    <Image src={item.mobile} alt="" fill sizes="110px" className="object-cover object-top" />
                  </span>
                </span>
              </a>

              <p className="eyebrow flex items-center gap-2.5 px-6 pt-6 text-ink-muted md:px-7 md:pt-7">
                <Nuqta size={7} tone={item.label.toLowerCase().startsWith('concept') ? 'muted' : 'mark'} />
                {item.label}
              </p>

              <div className="flex flex-col gap-2 px-6 pt-3 md:px-7">
                <h3 className="heading-1 m-0">{project.client}</h3>
                <p className="body-sm text-ink-muted">{project.title}</p>
              </div>

              <ul className="flex flex-col gap-2 border-t border-line mx-6 mt-5 pt-5 md:mx-7">
                {item.points.map((point) => (
                  <li key={point} className="flex items-baseline gap-2.5 body-sm">
                    <Icon name="check" size={14} className="flex-none translate-y-0.5 text-nuqta" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 px-6 pt-6 pb-6 md:px-7 md:pb-7">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClasses({ variant: 'primary', size: 'md', cut: true })}
                  style={{ '--cut': '12px' } as CSSProperties}
                >
                  <span>{copy.open}</span>
                  <Icon name="arrow-up-right" size={18} />
                </a>
                <Link
                  href={`/work/${project.slug}`}
                  className="group/case inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
                >
                  {copy.case}
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[160ms] ease-mark group-hover/case:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default WorkDemos;
