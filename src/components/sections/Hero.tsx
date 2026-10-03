import { Container } from '@/components/ui/Container';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Button } from '@/components/ui/Button';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { Site } from '@/lib/content';
import { HeroLattice } from './HeroLattice';
import { ProductStack } from './ProductStack';
import { BreathingNuqtas } from '@/components/brand/BreathingNuqtas';

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
 * from `lg`.
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
      <div className="pointer-events-none absolute end-6 top-[4.5rem] z-10 sm:end-8 lg:end-24 lg:top-20">
        <BreathingNuqtas className="w-14 text-ink sm:w-16 lg:w-20" glowId="hero-nuqta-glow" />
      </div>

      <Container className="relative z-10 flex flex-1 flex-col gap-6 pt-20 pb-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-24 lg:pb-10">
        <div className="contents lg:col-span-6 lg:flex lg:flex-col lg:gap-7">
          {/* Room at the end for the mark on narrow screens. */}
          <p className="eyebrow order-1 pe-20 text-ink-muted lg:order-none lg:pe-0">
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="display-xl order-2 m-0 lg:order-none">
            <span className="block">{hero.title[0]}</span>
            <span className="block">
              <StopText stamp>{hero.title[1] ?? ''}</StopText>
            </span>
          </h1>

          <p className="display-md order-3 m-0 max-w-[18ch] text-ink-muted lg:order-none">
            {hero.subtitle}
          </p>

          <p
            className="body-lg order-6 max-w-[44ch] text-ink-muted lg:order-none"
          >
            {hero.lead}
          </p>

          <div
            className="order-5 flex flex-col gap-3 lg:order-none lg:flex-row lg:flex-wrap lg:items-center"
          >
            <BookCallButton placement="hero" size="lg" block className="lg:w-auto">
              {hero.primaryCta}
            </BookCallButton>
            {/* Straight to the project brief in the contact band. */}
            <Button
              href="#order"
              variant="secondary"
              size="lg"
              iconEnd="arrow-right"
              block
              className="lg:w-auto"
            >
              {hero.secondaryCta}
            </Button>
            <p className="mt-1 flex items-center gap-2 font-mono text-[11px] text-ink-faint lg:hidden">
              <Nuqta size={7} />
              {hero.reassurance}
            </p>
          </div>

          <p
            className="hidden items-center gap-2 font-mono text-[12px] text-ink-faint lg:flex"
          >
            <Nuqta size={7} />
            {hero.reassurance}
          </p>
        </div>

        <div className="order-4 lg:order-none lg:col-span-6 lg:-me-12 xl:-me-20">
          <ProductStack
            alt={{
              dashboard: site.services.title,
              website: site.services.title,
              mobile: site.services.title,
            }}
          />
        </div>
      </Container>
    </section>
  );
}

export default Hero;
