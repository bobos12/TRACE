'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { Link } from '@/i18n/navigation';
import { bookingHref, bookingLinkProps, track, trackContact } from '@/lib/contact';
import type { Site } from '@/lib/content';

type Copy = Site['pricing'];
type Plan = Copy['software']['plans'][number];

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/** "Unlimited e-signatures — no envelope limits" → the lead in weight, the rest muted. */
function Feature({ text, strong }: { text: string; strong: boolean }) {
  const [head, ...rest] = text.split(' — ');
  return (
    <li className="flex items-start gap-3 text-[15px] leading-[22px] text-ink">
      <span
        className={cn(
          'mt-px grid size-5 flex-none place-items-center rounded-full',
          strong ? 'bg-nuqta text-on-nuqta' : 'text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]',
        )}
      >
        <Icon name="check" size={12} />
      </span>
      <span>
        {head}
        {rest.length ? <span className="text-ink-muted"> — {rest.join(' — ')}</span> : null}
      </span>
    </li>
  );
}

function SoftwareCard({ plan, copy }: { plan: Plan; copy: Copy }) {
  const sw = copy.software;
  const featured = Boolean(plan.featured);
  const placement = `landing:software-${plan.id}` as const;

  return (
    <article
      id={`trace-${plan.id}`}
      aria-labelledby={`software-${plan.id}`}
      className={cn(
        'relative flex h-full scroll-mt-28 flex-col rounded-lg border p-6 sm:p-7',
        featured
          ? 'band-carbon border-nuqta shadow-[0_0_0_1px_var(--nuqta),0_24px_60px_-20px_var(--nuqta)]'
          : 'border-line bg-surface-raised text-ink',
      )}
    >
      {plan.badge ? (
        <span className="absolute -top-3.5 end-5 inline-flex items-center gap-1.5 rounded-full bg-nuqta py-1.5 ps-2 pe-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-nuqta shadow-float">
          <span className="grid size-5 place-items-center rounded-full bg-on-nuqta text-nuqta">
            <Icon name="success" size={12} />
          </span>
          {plan.badge}
        </span>
      ) : null}

      <header className="flex items-center gap-3.5">
        <span
          className={cn(
            'grid size-11 flex-none place-items-center rounded-md',
            featured ? 'bg-nuqta text-on-nuqta' : 'bg-surface-sunken text-ink',
          )}
        >
          <Icon name={plan.icon} size={22} />
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 id={`software-${plan.id}`} className="heading-2 m-0">
            {plan.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{plan.audience}</p>
        </div>
      </header>
      <p className="body mt-4 text-ink-muted md:min-h-12">{plan.tagline}</p>

      {/* The price, the $1 first month, and the year. */}
      <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
        <p className="m-0 flex items-end gap-1.5">
          <span className="text-[clamp(2.75rem,2.3rem+1.4vw,3.5rem)] font-semibold leading-[0.85] tracking-[-0.05em]">
            {usd(plan.price)}
          </span>
          <span className="pb-1 text-[16px] text-ink-muted">{sw.perMonth}</span>
          <span className="mb-1 ms-auto rounded-full bg-nuqta-soft px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-nuqta">
            {sw.firstMonth}
          </span>
        </p>
        <p className="body-sm text-ink-muted">
          {sw.yearlyLine.replace('{total}', usd(plan.price * copy.billing.yearlyMonths))}
        </p>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <Link
          href={`/contact?product=${plan.id}#contact-form`}
          onClick={() => {
            trackContact('form', placement);
            track('software_select', { plan: plan.id });
          }}
          className={buttonClasses({
            variant: featured ? 'primary' : 'ink',
            size: 'lg',
            cut: true,
            block: true,
            className: 'group/sw',
          })}
          style={{ '--cut': '14px' } as CSSProperties}
        >
          <span>{sw.cta}</span>
          <Icon
            name="arrow-right"
            size={20}
            className="transition-transform duration-[160ms] ease-mark group-hover/sw:translate-x-1"
          />
        </Link>
        <a
          href={bookingHref()}
          {...bookingLinkProps}
          onClick={() => trackContact('booking', placement)}
          className="text-[13px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-nuqta"
        >
          {sw.callCta}
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5">
        <p className="eyebrow text-ink-muted">{sw.includesTitle}</p>
        <ul className="flex flex-col gap-3">
          {plan.features.map((f) => (
            <Feature key={f} text={f} strong={featured} />
          ))}
        </ul>
      </div>
    </article>
  );
}

/** The three software plans. The bundle is the one to choose: carbon, first on phones. */
export function SoftwareGrid({ copy }: { copy: Copy }) {
  return (
    <ul className="grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-4 lg:gap-6">
      {copy.software.plans.map((plan) => (
        <li key={plan.id} data-reveal="rise" className={cn(plan.featured && 'order-first md:order-none')}>
          <SoftwareCard plan={plan} copy={copy} />
        </li>
      ))}
    </ul>
  );
}

export default SoftwareGrid;
