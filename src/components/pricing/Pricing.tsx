import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { BookingLink } from '@/components/contact/BookingLink';
import { EmailLink } from '@/components/pricing/EmailLink';
import { OfferBanner } from '@/components/pricing/OfferBanner';
import { PlanGrid } from '@/components/pricing/PlanGrid';
import { cn } from '@/lib/cn';
import type { Site } from '@/lib/content';

/** What every plan promises, in one row under the cards. */
function Promises({ items }: { items: Site['pricing']['promises'] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-3 border-y border-line py-6 sm:grid-cols-3">
      {items.map((p) => (
        <li key={p.text} className="flex items-center gap-3 text-[15px] text-ink">
          <Icon name={p.icon} size={20} className="flex-none text-ink-muted" />
          {p.text}
        </li>
      ))}
    </ul>
  );
}

/** The promise that matters most, set large: $0 to start. */
function ZeroCallout({ zero }: { zero: Site['pricing']['zero'] }) {
  return (
    <div
      data-reveal="rise"
      className="at-cut flex h-full items-center gap-5 border-2 border-nuqta bg-nuqta-soft p-5 sm:gap-7 sm:p-6"
      style={{ '--cut': '20px' } as CSSProperties}
    >
      <span className="flex-none text-[clamp(3.5rem,2.8rem+2.4vw,5rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-nuqta">
        {zero.amount}
      </span>
      <span className="flex flex-col gap-1.5">
        <strong className="text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] font-semibold leading-tight tracking-[-0.015em] text-ink">
          {zero.title}
        </strong>
        <span className="text-[15px] leading-[22px] text-ink-muted">{zero.text}</span>
      </span>
    </div>
  );
}

/**
 * The plans. On the home page it has its own heading and sends people on to
 * the full comparison; on /pricing it opens the page with a one-line heading,
 * so the cards are in the first view.
 */
export function Pricing({ site, variant = 'home' }: { site: Site; variant?: 'home' | 'page' }) {
  const copy = site.pricing;
  const home = variant === 'home';

  return (
    <section
      id="pricing"
      aria-label={copy.eyebrow}
      className={cn('border-b border-line bg-surface', home ? 'py-[var(--section-y)]' : 'pt-24 pb-[var(--section-y)] md:pt-28')}
    >
      <Container className={cn('flex flex-col', home ? 'gap-10 md:gap-14' : 'gap-8 md:gap-10')}>
        {home ? (
          <SectionHead title={<StopText>{copy.title}</StopText>} lead={copy.lead} />
        ) : (
          <h1 className="display-md m-0">
            <StopText>{copy.page.title}</StopText>
          </h1>
        )}

        <div className="flex flex-col gap-3">
          <OfferBanner offer={copy.offer} />
          <ZeroCallout zero={copy.zero} />
        </div>

        <PlanGrid copy={copy} />
        <Promises items={copy.promises} />

        {/* Still deciding: the call, then email. */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-[52ch] flex-col gap-2">
            <h3 className="heading-2 m-0">{copy.help.title}</h3>
            <p className="body text-ink-muted">{copy.help.text}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <BookingLink placement="landing:pricing-help">{copy.help.cta}</BookingLink>
            <EmailLink placement="landing:pricing-help" subject={copy.help.title}>
              {copy.help.email}
            </EmailLink>
            {home ? (
              <Link
                href="/pricing"
                className="group/cta inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-nuqta"
              >
                {copy.homeMore}
                <Icon
                  name="arrow-right"
                  size={14}
                  className="transition-transform duration-[160ms] ease-mark group-hover/cta:translate-x-1"
                />
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Pricing;
