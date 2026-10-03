import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { BailBonds } from '@/lib/content';
import { Browser, Phone, Scaled } from './Frames';
import { IronwoodSite, SITE_H, SITE_W } from './Ironwood';
import { MapsScreen } from './Maps';

/**
 * The promise, then the proof of it: the agency's new site in a browser and,
 * in front, the 2 a.m. search on a phone with that agency on top.
 *
 * Copy paints on the first frame (it is the LCP candidate — see Hero.tsx);
 * only the two devices rise in, back to front. The four specs underneath are
 * what we build to, labelled as such.
 */
export function BailHero({ copy }: { copy: BailBonds }) {
  const { hero, demo, moment, maps } = copy;

  return (
    <section
      data-hero-band
      className="relative isolate overflow-hidden border-b border-line bg-surface"
      aria-labelledby="bail-hero-title"
    >
      <Container className="grid grid-cols-1 items-center gap-12 pt-28 pb-14 md:grid-cols-12 md:gap-8 md:pt-32 md:pb-20">
        <div className="flex flex-col gap-7 md:col-span-6 md:pe-6">
          <p className="eyebrow text-ink-muted">{hero.eyebrow}</p>
          <h1 id="bail-hero-title" className="display-xl m-0 text-[clamp(3rem,1.9rem+4.2vw,5.25rem)]">
            <span className="block">{hero.title[0]}</span>
            <span className="block">
              <StopText stamp>{hero.title[1]}</StopText>
            </span>
          </h1>
          <p className="body-lg max-w-[46ch] text-ink-muted">{hero.lead}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <BookCallButton placement="landing:bail-bonds-hero" size="lg">
              {hero.primaryCta}
            </BookCallButton>
            <Button href="#before-after" variant="secondary" size="lg" iconEnd="arrow-right">
              {hero.secondaryCta}
            </Button>
          </div>
          <p className="flex items-start gap-2 font-mono text-[12px] leading-5 text-ink-faint">
            <Nuqta size={7} className="mt-1.5" />
            {hero.reassurance}
          </p>
        </div>

        {/* The agency's site, and the search that finds it. */}
        <div className="relative mb-8 md:col-span-6 md:mb-0" aria-hidden="true">
          <div className="at-rise pe-[18%]" style={{ '--d': '200ms' } as CSSProperties}>
            <Browser url={demo.url}>
              <Scaled w={SITE_W} h={SITE_H}>
                <IronwoodSite demo={demo} />
              </Scaled>
            </Browser>
          </div>
          <div
            className="at-rise absolute end-0 -bottom-10 w-[32%] max-w-[210px] md:-bottom-14"
            style={{ '--d': '380ms' } as CSSProperties}
          >
            <Phone>
              <MapsScreen maps={maps} time={moment.timeline[1]!.time.replace(' AM', '')} />
            </Phone>
          </div>
          <p className="absolute -top-7 start-0 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase">
            <span className="size-1.5 rotate-45 bg-ink-faint" />
            {demo.concept}
          </p>
        </div>
      </Container>

      {/* What we build to. */}
      <Container className="pb-16 md:pb-20">
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {hero.specs.map((s, i) => (
            <div
              key={s.text}
              className={`flex flex-col gap-3 border-b border-line py-6 pe-4 md:border-b-0 md:py-8 ${i % 2 === 1 ? 'ps-4 border-s md:ps-6' : ''} ${i >= 2 ? 'md:border-s md:ps-6' : ''}`}
            >
              <dt className="order-2 body-sm max-w-[28ch] text-ink-muted">{s.text}</dt>
              <dd className="order-1 m-0 flex items-baseline font-sans text-[clamp(2.5rem,1.8rem+2.4vw,4rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                {s.prefix ? <span className="me-0.5 text-[0.6em] text-ink-muted">{s.prefix}</span> : null}
                {s.value}
                <span className="ms-1 text-[0.36em] font-medium tracking-normal text-vermilion">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[11px] text-ink-faint">{hero.specsNote}</p>
      </Container>
    </section>
  );
}

export default BailHero;
