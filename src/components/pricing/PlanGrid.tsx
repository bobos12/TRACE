'use client';

import { useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { bookingHref, bookingLinkProps, mailHref, track, trackContact } from '@/lib/contact';
import type { Site } from '@/lib/content';

type Copy = Site['pricing'];
type Plan = Copy['plans'][number];
export type Billing = 'monthly' | 'yearly';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const fill = (t: string, vars: Record<string, string>) =>
  t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);

/** Monthly, or Yearly with the months it saves — a segmented switch. */
function BillingSwitch({ copy, value, onChange }: { copy: Copy; value: Billing; onChange: (b: Billing) => void }) {
  const option = (b: Billing, label: string, extra?: string) => (
    <button
      type="button"
      aria-pressed={value === b}
      onClick={() => onChange(b)}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-sm px-4 text-[14px] font-medium transition-[background-color,color] duration-[160ms] ease-mark',
        value === b ? 'bg-ink text-surface' : 'text-ink-muted hover:text-ink',
      )}
    >
      {label}
      {extra ? (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]',
            value === b ? 'bg-nuqta text-on-nuqta' : 'bg-nuqta-soft text-nuqta',
          )}
        >
          {extra}
        </span>
      ) : null}
    </button>
  );

  return (
    <div
      role="group"
      aria-label={copy.billing.label}
      className="inline-flex items-center gap-1 rounded-md border border-line-strong bg-surface-raised p-1"
    >
      {option('monthly', copy.billing.monthly)}
      {option('yearly', copy.billing.yearly, copy.billing.save)}
    </div>
  );
}

/** "TRACE Bail — the CRM" → the product name set in weight, the rest plain. */
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
      {rest.length ? (
        <span>
          <strong className="font-semibold">{head}</strong>
          <span className="text-ink-muted"> — {rest.join(' — ')}</span>
        </span>
      ) : (
        <span>{text}</span>
      )}
    </li>
  );
}

/**
 * The AI agent as a coupon: a dashed ticket with notches cut into its sides,
 * the "Bonus" tag, and its price struck down to $0.
 */
function BonusTicket({ bonus, copy, featured }: { bonus: Plan['bonus']; copy: Copy; featured: boolean }) {
  // The notches take the card's own colour, so they read as holes in the ticket.
  const notch = cn(
    'absolute top-1/2 size-4 -translate-y-1/2 rounded-full border border-dashed border-nuqta/60',
    featured ? 'bg-surface' : 'bg-surface-raised',
  );
  return (
    <div className="relative mt-6 rounded-md border border-dashed border-nuqta/60 bg-nuqta/[0.06] px-5 py-4">
      <span aria-hidden="true" className={cn(notch, '-start-2 [clip-path:inset(0_0_0_50%)]')} />
      <span aria-hidden="true" className={cn(notch, '-end-2 [clip-path:inset(0_50%_0_0)]')} />
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-sm bg-nuqta px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-nuqta">
            <Icon name="plus" size={10} />
            {copy.bonusTag}
          </span>
          <span className="text-[14px] font-medium leading-5 text-ink">{bonus.label}</span>
        </div>
        <div className="flex flex-none flex-col items-end gap-0.5 text-end">
          <span className="flex items-baseline gap-2">
            <s className="text-[13px] text-ink-faint">{bonus.value}</s>
            <span className="text-[26px] font-semibold leading-none tracking-[-0.03em] text-nuqta">{copy.free}</span>
          </span>
          <span className="max-w-[8.5rem] font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">{bonus.tag}</span>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  prev,
  copy,
  billing,
  swapped,
}: {
  plan: Plan;
  prev?: Plan;
  copy: Copy;
  billing: Billing;
  swapped: boolean;
}) {
  const yearly = billing === 'yearly';
  const months = copy.billing.yearlyMonths;
  const perMonth = yearly ? (plan.price * months) / 12 : plan.price;
  const save = usd(plan.price * (12 - months));
  const billingLabel = yearly ? copy.billing.yearly.toLowerCase() : copy.billing.monthly.toLowerCase();
  const featured = Boolean(plan.featured);
  const placement = `landing:pricing-${plan.id}` as const;

  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-lg border transition-[transform,box-shadow] duration-[320ms] ease-mark',
        featured
          ? 'band-carbon border-nuqta shadow-[0_0_0_1px_var(--nuqta),0_24px_60px_-20px_var(--nuqta)] md:-mt-8 md:h-[calc(100%+4rem)]'
          : 'border-line bg-surface-raised text-ink hover:-translate-y-1 hover:shadow-float',
      )}
    >
      {/* The plan we want chosen wears a vermilion bar across the top. */}
      {featured ? (
        <p className="m-0 flex h-10 items-center justify-center gap-2.5 bg-nuqta font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-on-nuqta">
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-on-nuqta" />
          {copy.popular}
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-on-nuqta" />
        </p>
      ) : null}

      <div className={cn('flex flex-1 flex-col p-6 sm:p-8', featured && 'md:pb-12')}>
        {/* The mark, the name, who it is for. */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className={cn(
                'grid size-11 flex-none place-items-center rounded-md',
                featured ? 'bg-nuqta text-on-nuqta' : 'bg-surface-sunken text-ink',
              )}
            >
              <Icon name={plan.icon} size={22} />
            </span>
            <div className="flex flex-col gap-0.5">
              <h3 id={`plan-${plan.id}`} className="heading-1 m-0 leading-none">
                {plan.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{plan.audience}</p>
            </div>
          </div>
          <p className="body text-ink-muted md:min-h-12">{plan.tagline}</p>
        </header>

        {/* The price. The struck monthly figure and the saving appear on yearly. */}
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6">
          <div className="flex min-h-6 items-center gap-2.5" aria-hidden={!yearly}>
            {yearly ? (
              <>
                <s className="text-[15px] text-ink-faint decoration-nuqta decoration-2">{usd(plan.price)}</s>
                <span className="rounded-full bg-nuqta px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-on-nuqta">
                  {fill(copy.billing.saveBadge, { save })}
                </span>
              </>
            ) : null}
          </div>
          <p className="m-0 flex items-end gap-1.5">
            <span
              key={billing}
              className={cn(
                'text-[clamp(3.5rem,2.8rem+2vw,4.5rem)] font-semibold leading-[0.85] tracking-[-0.05em]',
                swapped && 'at-rise',
              )}
            >
              {usd(perMonth)}
            </span>
            <span className="pb-1 text-[16px] text-ink-muted">{copy.billing.perMonth}</span>
          </p>
          <p className="body-sm text-ink-muted">
            {yearly
              ? fill(copy.billing.billedYearly, { total: usd(plan.price * months), save })
              : copy.billing.billedMonthly}
          </p>
          {featured && prev ? (
            <p className="body-sm flex items-center gap-2 font-medium text-ink">
              <Icon name="arrow-up-right" size={14} className="text-nuqta" />
              {fill(copy.upgradeNote, { diff: usd(plan.price - prev.price), prev: prev.name })}
            </p>
          ) : null}
        </div>

        <BonusTicket bonus={plan.bonus} copy={copy} featured={featured} />

        {/* The action: book the call that starts the plan; email as the quiet second way. */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href={bookingHref()}
            {...bookingLinkProps}
            onClick={() => {
              trackContact('booking', placement);
              track('plan_select', { plan: plan.id, billing });
            }}
            className={buttonClasses({
              variant: featured ? 'primary' : 'ink',
              size: 'lg',
              cut: true,
              block: true,
              className: 'group/plan',
            })}
            style={{ '--cut': '14px' } as CSSProperties}
          >
            <span>{plan.cta}</span>
            <Icon
              name="arrow-right"
              size={20}
              className="transition-transform duration-[160ms] ease-mark group-hover/plan:translate-x-1"
            />
          </a>
          <a
            href={mailHref(
              fill(copy.emailSubject, { plan: plan.name, billing: billingLabel }),
              fill(copy.emailBody, { plan: plan.name, billing: billingLabel }),
            )}
            onClick={() => trackContact('email', placement)}
            className="text-[13px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-nuqta"
          >
            {copy.emailCta}
          </a>
        </div>

        {/* What the plan includes. */}
        <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6">
          <p className="eyebrow text-ink-muted">{plan.includesTitle}</p>
          <ul className="flex flex-col gap-3">
            {plan.features.map((f) => (
              <Feature key={f} text={f} strong={featured} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/**
 * The three plans with the billing switch above them. Growth is the one we
 * want chosen: on carbon, lifted, first on phones, with the vermilion button.
 */
export function PlanGrid({ copy }: { copy: Copy }) {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [swapped, setSwapped] = useState(false);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BillingSwitch
          copy={copy}
          value={billing}
          onChange={(b) => {
            setBilling(b);
            setSwapped(true);
            track('pricing_billing', { billing: b });
          }}
        />
        <p className="body-sm text-ink-muted" aria-live="polite">
          {billing === 'yearly' ? copy.billing.applied : copy.billing.nudge}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-stretch md:gap-4 lg:gap-6">
        {copy.plans.map((plan, i) => (
          <li key={plan.id} data-reveal="rise" className={cn(plan.featured && 'order-first md:order-none')}>
            <PlanCard plan={plan} prev={copy.plans[i - 1]} copy={copy} billing={billing} swapped={swapped} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlanGrid;
