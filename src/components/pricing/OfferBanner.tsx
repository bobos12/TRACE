'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Site } from '@/lib/content';

type Offer = Site['pricing']['offer'];

const DAY = 86_400_000;

/**
 * The year-end offer as a thin moving strap — a notice, not a block. The days
 * left are counted in the visitor's browser (the page is static, so a count
 * baked in at build time would go stale); until it hydrates it shows the end
 * date, and once the offer has ended the strap hides. Screen readers get the
 * sentence once; the moving copies are hidden from them.
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

  const item = (
    <span className="flex flex-none items-center gap-4 pe-10">
      <span aria-hidden="true" className="size-2 rotate-45 bg-nuqta" />
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-nuqta">{offer.label}</span>
      <span className="text-[14px] text-ink">{offer.text}</span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
        <Icon name="clock" size={13} className="text-nuqta" />
        {count}
      </span>
    </span>
  );

  return (
    <div className="band-carbon relative overflow-hidden rounded-md border border-nuqta/40">
      <p className="sr-only">
        {offer.label}: {offer.text} {count}.
      </p>
      <div
        aria-hidden="true"
        className="at-marquee flex h-10 w-max items-center hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:px-4"
      >
        {[0, 1].map((half) => (
          <span key={half} className="flex flex-none motion-reduce:[&:nth-child(2)]:hidden">
            {item}
            {item}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default OfferBanner;
