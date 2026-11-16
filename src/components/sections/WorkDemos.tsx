import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Browser } from '@/components/bail/Frames';
import { PhoneShot } from '@/components/sections/Showcase';
import { buttonClasses } from '@/components/ui/buttonStyles';
import type { LocalProject, Site } from '@/lib/content';

type Demos = Site['pages']['work']['demos'];

/**
 * The live demos, before the index: each one large, in a browser with the
 * phone version over its corner, labelled for what it is, with one button
 * that opens it and the case study beside. A carbon band, so they read as
 * the thing to try first.
 */
export function WorkDemos({ copy, projects }: { copy: Demos; projects: LocalProject[] }) {
  const demos = copy.items.flatMap((item) => {
    const project = projects.find((p) => p.slug === item.slug);
    return project?.links.demo ? [{ item, project, href: project.links.demo }] : [];
  });
  if (!demos.length) return null;

  return (
    <section className="band-carbon border-b border-line bg-surface py-[var(--section-y)] text-ink" aria-labelledby="work-demos-title">
      <Container className="flex flex-col gap-12 md:gap-16">
        <SectionHead title={<span id="work-demos-title"><StopText>{copy.title}</StopText></span>} lead={copy.lead} size="md" />

        <ul className="grid grid-cols-1 gap-16 xl:grid-cols-3 xl:gap-8">
          {demos.map(({ item, project, href }, i) => (
            <Reveal as="li" key={item.slug} delay={i * 0.08} className="flex flex-col gap-8 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10 xl:flex">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${copy.open} — ${project.client}`}
                className="group/demo relative block pe-[14%] pb-8"
              >
                <Browser url={item.url}>
                  <span className="relative block aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={item.desktop}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 86vw, (max-width: 1280px) 52vw, 400px"
                      className="object-cover object-top transition-transform duration-[600ms] ease-mark group-hover/demo:scale-[1.02]"
                    />
                  </span>
                </Browser>
                <PhoneShot src={item.mobile} className="absolute end-0 bottom-0 w-[27%] max-w-[170px]" />
              </a>

              <div className="flex flex-col gap-5">
                <p className="eyebrow flex items-center gap-2.5 text-ink-muted">
                  <Nuqta size={7} tone={i === 0 ? 'mark' : 'muted'} />
                  {item.label}
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="heading-1 m-0">{project.client}</h3>
                  <p className="body text-ink-muted max-w-[52ch]">{project.title}</p>
                </div>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-1">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-baseline gap-2.5 body-sm">
                      <Icon name="check" size={14} className="flex-none translate-y-0.5 text-nuqta" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-4">
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
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default WorkDemos;
