import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { SoftwareGrid } from '@/components/pricing/SoftwarePlans';
import { BookingLink } from '@/components/contact/BookingLink';
import { EmailLink } from '@/components/pricing/EmailLink';
import { OfferBanner } from '@/components/pricing/OfferBanner';
import { PlanGrid } from '@/components/pricing/PlanGrid';
import { cn } from '@/lib/cn';
import type { Site } from '@/lib/content';

/** What every plan promises, in one row under the cards. */
function Promises({ items }: { items: Site['pricing']['promises'] }) {
  return (
    <ul className="flex flex-col items-center gap-x-12 gap-y-3 border-y border-line py-6 sm:flex-row sm:flex-wrap sm:justify-center">
      {items.map((p) => (
        <li key={p.text} className="flex items-center gap-3 text-[15px] text-ink">
          <Icon name={p.icon} size={20} className="flex-none text-ink-muted" />
          {p.text}
        </li>
      ))}
    </ul>
  );
}

/** The founding-customer offer: a quiet badge beside the page heading. No counter. */
function Founding({ founding }: { founding: Site['pricing']['founding'] }) {
  return (
    <p className="m-0 inline-flex items-center gap-3 self-start rounded-full bg-surface-raised py-2 ps-3 pe-4 text-[14px] text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] md:self-auto">
      <Nuqta size={8} />
      <span>
        <strong className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-nuqta">{founding.label}</strong>
        <span className="text-ink-muted"> · </span>
        {founding.text}
      </span>
    </p>
  );
}

/** On the home page: the software on its own, in one line, with the way to the plans. */
function SoftwareTeaser({ copy }: { copy: Site['pricing'] }) {
  const sw = copy.software;
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface-raised p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="heading-2 m-0">{sw.homeTitle}</h3>
        <p className="body text-ink-muted">{sw.homeText}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <ul className="flex flex-wrap gap-2">
          {sw.plans.map((p) => (
            <li
              key={p.id}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[14px]',
                p.featured ? 'bg-ink text-surface' : 'text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]',
              )}
            >
              {p.name} <strong className="font-semibold">${p.price}</strong>
              {sw.perMonth}
            </li>
          ))}
        </ul>
        <Link
          href="/pricing#software"
          className="group/cta inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[5px] hover:decoration-nuqta"
        >
          {sw.homeCta}
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-[160ms] ease-mark group-hover/cta:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

/** /pricing: TRACE Bail and TRACE Sign on their own, with their terms. */
export function SoftwarePricing({ site }: { site: Site }) {
  const copy = site.pricing;
  const sw = copy.software;
  return (
    <section
      id="software"
      aria-labelledby="software-title"
      className="scroll-mt-20 border-b border-line bg-surface py-[var(--section-y)]"
    >
      <Container className="flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-5">
          <h2 id="software-title" className="display-md m-0">
            <StopText>{sw.title}</StopText>
          </h2>
          <p className="body-lg max-w-[56ch] text-ink-muted">{sw.lead}</p>
        </div>
        <SoftwareGrid copy={copy} />
        <div className="flex flex-col gap-4 border-y border-line py-6">
          <ul className="flex flex-col gap-x-8 gap-y-3 sm:flex-row">
            {sw.terms.map((term) => (
              <li key={term.text} className="flex items-center gap-3 text-[15px] text-ink">
                <Icon name={term.icon} size={20} className="flex-none text-ink-muted" />
                {term.text}
              </li>
            ))}
          </ul>
          <p className="body-sm text-ink-faint">{sw.smallPrint}</p>
        </div>
      </Container>
    </section>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="display-md m-0">
              <StopText>{copy.page.title}</StopText>
            </h1>
            <Founding founding={copy.founding} />
          </div>
        )}

        <OfferBanner offer={copy.offer} />

        <PlanGrid copy={copy} />
        <div className="md:mt-8">
          <Promises items={copy.promises} />
        </div>
        {home ? <SoftwareTeaser copy={copy} /> : null}

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
