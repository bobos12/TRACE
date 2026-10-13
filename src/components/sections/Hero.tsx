import { Container } from '@/components/ui/Container';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Button } from '@/components/ui/Button';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { Site } from '@/lib/content';
import { HeroLattice } from './HeroLattice';
import { ProductStack } from './ProductStack';
import { BreathingNuqtas } from '@/components/brand/BreathingNuqtas';
import { CountUp } from '@/components/motion/CountUp';

/**
 * The hero — "The Mark".
 *
 * A **server component**, and its copy carries *no* entrance animation.
 *
 * Anything that starts hidden — a motion `initial`, a CSS fade, a masked line
 * reveal — stops the browser counting that text as painted, and the hero
 * headline is the LCP element. Every variant we measured cost 2.2–3.1s of LCP
 * render delay. The copy now paints on the first frame.
 *
 * The signature entrance moves to elements that can never be the LCP
 * candidate: the nuqta stamps in, the product stack assembles back to front,
 * and the trace draws itself across the foot of the band. See DECISIONS.md.
 *
 * The two interactive pieces stay client islands: the lattice and the stack.
 *
 * Mobile order is text → product stack → CTAs, with the booking button still
 * above the fold at 390×844. One DOM serves both layouts: the text block is
 * `display: contents` on mobile so its children become flex items that
 * `order-*` can rearrange, and becomes the left column of a 12-column grid
 * from `md` (1024px — this system's `lg` is 1440).
 */
export function Hero({ site }: { site: Site }) {
  const { hero } = site;

  return (
    <section
      data-hero-band
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-surface text-ink"
      aria-labelledby="hero-title"
    >
      <HeroLattice />

      {/* TRACE's mark in the screen's upper trailing corner,
          its nuqta breathing — pinned to the viewport edge, not the content
          column, so it stays in the corner on wide screens. Decorative. */}
      <div className="pointer-events-none absolute end-6 top-[4.5rem] z-10 sm:end-8 md:end-24 md:top-20">
        <BreathingNuqtas className="w-14 text-ink sm:w-16 md:w-20" glowId="hero-nuqta-glow" />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col gap-6 pt-20 pb-8 md:grid md:grid-cols-12 md:items-center md:gap-8 md:pt-24 md:pb-10">
        <div className="contents md:col-span-6 md:flex md:flex-col md:gap-7">
          {/* The page's h1 is the eyebrow — the studio's name and what it
              does. The display line below is the tagline. Room at the end
              for the mark on narrow screens. */}
          <h1 id="hero-title" className="eyebrow order-1 m-0 pe-20 text-ink-muted md:order-none md:pe-0">
            {hero.eyebrow}
          </h1>

          <p className="display-xl order-2 m-0 md:order-none">
            <span className="block">{hero.title[0]}</span>
            <span className="block">
              <StopText stamp>{hero.title[1] ?? ''}</StopText>
            </span>
          </p>

          <p className="display-md order-3 m-0 max-w-[18ch] text-ink-muted md:order-none">
            {hero.subtitle}
          </p>

          <p
            id="hero-lead"
            className="body-lg order-6 max-w-[44ch] text-ink-muted max-md:hidden md:order-none"
          >
            {hero.lead}
          </p>

          <div
            className="order-5 flex flex-col gap-3 md:order-none md:flex-row md:flex-wrap md:items-center"
          >
            <BookCallButton placement="hero" size="lg" block className="md:w-auto">
              {hero.primaryCta}
            </BookCallButton>
            {/* Down to the live demo, the strongest proof on the page. */}
            <Button
              href="#demo"
              variant="secondary"
              size="lg"
              iconEnd="arrow-right"
              block
              className="md:w-auto"
            >
              {hero.secondaryCta}
            </Button>
            <p className="mt-1 flex items-center gap-2 font-mono text-[11px] text-ink-faint md:hidden">
              <Nuqta size={7} />
              {hero.reassurance}
            </p>
          </div>

          <p
            className="hidden items-center gap-2 font-mono text-[12px] text-ink-faint md:flex"
          >
            <Nuqta size={7} />
            {hero.reassurance}
          </p>

          {/* The track record, set small under the call to action. */}
          <dl className="order-7 m-0 grid max-w-[560px] grid-cols-4 gap-3 border-t border-line pt-5 sm:gap-6 md:order-none">
            {site.trust.stats.map((stat) => {
              const plus = stat.value.includes('+');
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-start">
                  <dd
                    dir="ltr"
                    className="order-1 m-0 flex items-start self-center md:self-start text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums"
                  >
                    <CountUp value={stat.value.replace('+', '')} />
                    {plus ? (
                      <span aria-hidden="true" className="ms-0.5 text-[0.5em] font-medium text-vermilion">
                        +
                      </span>
                    ) : null}
                    {plus ? <span className="sr-only">+</span> : null}
                  </dd>
                  <dt className="order-2 text-[12px] leading-snug text-ink-muted sm:text-[13px]">
                    <span className="md:hidden">{stat.short}</span>
                    <span className="max-md:hidden">{stat.label}</span>
                  </dt>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="order-4 md:order-none md:col-span-6 md:-me-12 xl:-me-20">
          <ProductStack alt={hero.visualAlt} />
        </div>
      </Container>
    </section>
  );
}

export default Hero;
