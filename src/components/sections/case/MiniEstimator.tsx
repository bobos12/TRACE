'use client';

import { useId, useState } from 'react';
import type { BailBonds } from '@/lib/content';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/**
 * The bond cost estimator, card-sized: drag the bail amount, read the premium
 * and the plan. California's 10% rate; 30% down, the rest over six months —
 * the same example as the full estimator on /bail-bonds.
 */
export function MiniEstimator({ copy }: { copy: BailBonds['details']['estimator'] }) {
  const id = useId();
  const [bail, setBail] = useState(15000);
  const premium = bail / 10;
  const down = Math.round(premium * 0.3);
  const monthly = Math.round((premium - down) / 6);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={`${id}-bail`} className="text-[12px] text-ink-muted">
            {copy.bailLabel}
          </label>
          <output htmlFor={`${id}-bail`} className="font-mono text-[13px] text-ink tabular-nums">
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
      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-3" aria-live="polite">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{copy.premiumLabel}</span>
        <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
          {usd.format(premium)}
        </span>
        <span className="pt-1 text-[12px] text-ink-muted">
          <b className="font-semibold text-ink tabular-nums">{usd.format(down)}</b> {copy.planNote}{' '}
          <b className="font-semibold text-ink tabular-nums">{usd.format(monthly)}</b>
          {copy.perMonth}
        </span>
      </div>
    </div>
  );
}

export default MiniEstimator;
