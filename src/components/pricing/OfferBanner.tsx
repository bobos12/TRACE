'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Nuqta } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import type { Site } from '@/lib/content';

type Offer = Site['pricing']['offer'];

const DAY = 86_400_000;

/**
 * The year-end offer, with the days left counted in the visitor's browser —
 * the page is static, so a count baked in at build time would go stale.
 * Until it hydrates it shows the end date; once the offer has ended it hides.
 */
export function OfferBanner({ offer }: { offer: Offer }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const ends = new Date(offer.ends).getTime();
    const tick = () => setLeft(Math.ceil((ends - Date.now()) / DAY));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [offer.ends]);

  if (left !== null && left <= 0) return null;

  const count =
    left === null
      ? offer.endsLabel
      : left === 1
        ? offer.lastDay
        : left === 2
          ? offer.oneDay
          : offer.daysLeft.replace('{n}', String(left - 1));

  return (
    <div
      data-reveal="rise"
      className="band-carbon at-cut flex flex-col gap-4 border border-nuqta/50 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
      style={{ '--cut': '20px' } as CSSProperties}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="mt-1.5 flex-none">
          <Nuqta size={12} stamp />
        </span>
        <p className="m-0 flex flex-col gap-1">
          <span className="eyebrow text-nuqta">{offer.label}</span>
          <span className="text-[16px] leading-6 text-ink sm:text-[17px]">{offer.text}</span>
        </p>
      </div>
      <p
        className="m-0 inline-flex flex-none items-center gap-2 self-start rounded-full bg-surface-raised px-4 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] sm:self-center"
        aria-live="off"
      >
        <Icon name="clock" size={14} className="text-nuqta" />
        {count}
      </p>
    </div>
  );
}

export default OfferBanner;
