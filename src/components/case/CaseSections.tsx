import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { StopText } from '@/components/brand/Nuqta';
import { Browser } from '@/components/bail/Frames';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { LocalProject, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

/*
 * The richer half of a case study: what it does for the business, the
 * screens one by one, the phone, the whole page, and the ask. Every image is
 * a genuine capture or a real product render (scripts/make-case-assets.mjs).
 */

type Media = NonNullable<LocalProject['media']>;

/** A phone bezel in tokens around a 390×844 @2x capture. */
function Phone({ src, alt = '', className }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={cn('band-carbon overflow-hidden rounded-[26px] p-1.5 shadow-float ring-1 ring-line-strong', className)}>
      <Image src={src} alt={alt} width={780} height={1688} sizes="220px" className="h-auto w-full rounded-[20px]" />
    </div>
  );
}

/** What the work does for the business — three cards under the cover. */
export function CaseHighlights({ project, ui }: { project: LocalProject; ui: Site['ui'] }) {
  if (!project.highlights.length) return null;
  return (
    <section className="border-b border-line bg-surface pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
      <Container className="flex flex-col gap-10">
        <SectionHead title={<StopText>{ui.caseHighlights}</StopText>} size="md" />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {project.highlights.map((h, i) => (
            <li
              key={h.title}
              data-reveal="rise"
              style={{ '--d': `${i * 80}ms`, '--cut': '24px' } as CSSProperties}
              className="at-cut flex flex-col gap-4 border border-line bg-surface-raised p-6 md:p-8"
            >
              <span className="font-mono text-[clamp(2rem,1.6rem+1vw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-nuqta">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="heading-2 m-0">{h.title}</h3>
              <p className="body text-ink-muted">{h.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** The screens, one feature at a time, alternating sides. */
export function CaseRows({ project, media, ui }: { project: LocalProject; media: Media; ui: Site['ui'] }) {
  if (!media.rows.length) return null;
  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-14 md:gap-20">
        <SectionHead title={<StopText>{ui.caseInside}</StopText>} size="md" />
        <ol className="flex flex-col gap-16 md:gap-24">
          {media.rows.map((row, i) => {
            const copy = project.rows[i]!;
            const flip = i % 2 === 1;
            return (
              <li key={row.image} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div
                  data-reveal="rise"
                  className={cn('relative lg:col-span-7', flip && 'lg:order-2', row.phone && (flip ? 'ps-[10%]' : 'pe-[10%]'), row.phone && 'pb-8')}
                >
                  {row.frame === 'none' ? (
                    <span className="at-cut relative block aspect-[16/10] w-full overflow-hidden bg-carbon" style={{ '--cut': '28px' } as CSSProperties}>
                      <Image src={row.image} alt={copy.title} fill sizes="(max-width: 1024px) 92vw, 760px" className="object-cover" />
                    </span>
                  ) : (
                    <Browser url={project.client}>
                      <span className="relative block aspect-[16/10] w-full overflow-hidden">
                        <Image src={row.image} alt={copy.title} fill sizes="(max-width: 1024px) 92vw, 760px" className="object-cover object-top" />
                      </span>
                    </Browser>
                  )}
                  {row.phone ? (
                    <ScrollProgress className={cn('absolute bottom-0 w-[24%] max-w-[190px]', flip ? 'start-0' : 'end-0')}>
                      <div className="at-drift" style={{ '--drift': '64px' } as CSSProperties}>
                        <Phone src={row.phone} />
                      </div>
                    </ScrollProgress>
                  ) : null}
                </div>
                <div
                  data-reveal="rise"
                  style={{ '--d': '120ms' } as CSSProperties}
                  className={cn('flex flex-col gap-4 lg:col-span-5', flip && 'lg:order-1')}
                >
                  <span className="font-mono text-[12px] text-nuqta">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="display-md m-0">
                    <StopText>{copy.title}</StopText>
                  </h3>
                  <p className="body-lg max-w-[44ch] text-ink-muted">{copy.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

/** The phone screens side by side, on carbon; a swipe row on phones. */
export function CaseMobiles({ media, ui }: { media: Media; ui: Site['ui'] }) {
  if (media.mobiles.length < 3) return null;
  return (
    <section className="band-carbon border-b border-line bg-surface py-[var(--section-y)] text-ink">
      <Container className="flex flex-col gap-12">
        <SectionHead title={<StopText>{ui.caseMobile}</StopText>} lead={ui.caseMobileText} size="md" />
        <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {media.mobiles.map((src, i) => (
            <li
              key={src}
              data-reveal="rise"
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
              className={cn('w-[58%] flex-none snap-start md:w-auto', i % 2 === 1 && 'md:translate-y-10')}
            >
              <Phone src={src} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * The whole page in a browser that scrolls through itself on hover (or focus)
 * — transform only. Under reduced motion it is an ordinary scrollable frame.
 */
export function CaseFullPage({ project, media, ui }: { project: LocalProject; media: Media; ui: Site['ui'] }) {
  if (!media.full) return null;
  const { src, width, height } = media.full;
  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-10">
        <SectionHead title={<StopText>{ui.caseFull}</StopText>} lead={ui.caseFullHint} size="md" />
        <div data-reveal="rise" className="mx-auto w-full max-w-[1040px]">
          <Browser url={project.client}>
            <div
              tabIndex={0}
              aria-label={`${ui.caseFull} — ${project.client}`}
              className="at-scrollshot relative focus-visible:outline-none"
              // Longer pages take longer to travel, at the same reading pace.
              style={{ '--scroll-time': `${Math.max(4, Math.round((height / width) * 1.6))}s` } as CSSProperties}
            >
              <Image
                src={src}
                alt={`${project.client}: the whole page, top to bottom`}
                width={width}
                height={height}
                sizes="(max-width: 1100px) 92vw, 1040px"
                className="absolute inset-x-0 top-0 h-auto w-full"
              />
            </div>
          </Browser>
        </div>
      </Container>
    </section>
  );
}

/** The ask, between the proof and the next project. */
export function CaseCta({ site, project }: { site: Site; project: LocalProject }) {
  const { ui } = site;
  return (
    <section className="band-carbon border-b border-line bg-surface py-16 text-ink md:py-20">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex max-w-[40rem] flex-col gap-3">
          <h2 className="display-md m-0">{ui.caseCtaTitle}</h2>
          <p className="body-lg text-ink-muted">{ui.caseCtaText}</p>
        </div>
        <BookCallButton placement={`project:${project.slug}`} size="lg">
          {site.cta.book}
        </BookCallButton>
      </Container>
    </section>
  );
}
