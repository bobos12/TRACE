'use client';

import { useId, useState } from 'react';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';

type Details = BailBonds['details'];

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const RATES = [10, 12, 15];

/**
 * The bond cost estimator, as it would sit on the agency's site: bail amount
 * and premium rate in, the premium and a payment plan out. Example plan: 30%
 * down, the rest over six months.
 */
export function Estimator({ copy }: { copy: Details['estimator'] }) {
  const id = useId();
  const [bail, setBail] = useState(15000);
  const [rate, setRate] = useState(10);

  const premium = (bail * rate) / 100;
  const down = Math.round(premium * 0.3);
  const monthly = Math.round((premium - down) / 6);

  return (
    <div className="flex flex-col gap-6 rounded-md border border-line bg-surface-raised p-5 sm:p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`${id}-bail`} className="label text-ink-muted">
            {copy.bailLabel}
          </label>
          <output htmlFor={`${id}-bail`} className="data text-ink">
            {usd.format(bail)}
          </output>
        </div>
        <input
          id={`${id}-bail`}
          type="range"
          min={1000}
          max={100000}
          step={500}
          value={bail}
          onChange={(e) => setBail(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-[var(--nuqta)]"
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="label mb-3 text-ink-muted">{copy.rateLabel}</legend>
        <div className="grid grid-cols-3 gap-2">
          {RATES.map((r) => (
            <label
              key={r}
              className={cn(
                'flex h-10 cursor-pointer items-center justify-center rounded-md border text-[14px] font-medium transition-colors duration-[160ms] ease-mark has-[:focus-visible]:shadow-focus-ring',
                rate === r ? 'border-ink bg-ink text-surface' : 'border-line-strong bg-surface text-ink hover:border-ink',
              )}
            >
              <input
                type="radio"
                name={`${id}-rate`}
                value={r}
                checked={rate === r}
                onChange={() => setRate(r)}
                className="sr-only"
              />
              {r}%
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4 border-t border-line pt-5" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-ink-faint">{copy.premiumLabel}</span>
          <span className="text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            {usd.format(premium)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-ink-faint">{copy.planLabel}</span>
          <span className="body-sm text-ink">
            <span className="font-semibold tabular-nums">{usd.format(down)}</span> {copy.planNote}{' '}
            <span className="font-semibold tabular-nums">{usd.format(monthly)}</span>
            {copy.perMonth}
          </span>
        </div>
      </div>
      <p className="font-mono text-[11px] leading-4 text-ink-faint">{copy.disclaimer}</p>
    </div>
  );
}

/** English ⇄ Español, switching the agency's headline. */
export function LanguageToggle({ copy }: { copy: Details['language'] }) {
  const [lang, setLang] = useState<0 | 1>(0);

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label={copy.title} className="inline-flex w-fit rounded-md border border-line-strong p-1">
        {copy.labels.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={lang === i}
            onClick={() => setLang(i as 0 | 1)}
            className={cn(
              'h-8 rounded-sm px-3.5 text-[13px] font-medium transition-colors duration-[160ms] ease-mark',
              lang === i ? 'bg-ink text-surface' : 'text-ink-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <p
        key={lang}
        lang={lang === 0 ? 'en' : 'es'}
        className="bb-arrive text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]"
      >
        {lang === 0 ? copy.en : copy.es}
      </p>
    </div>
  );
}
