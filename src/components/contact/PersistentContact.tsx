'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { bookingHref, bookingLinkProps, mailHref, trackContact } from '@/lib/contact';

/**
 * Visibility rule shared by both controls: appear once the hero has scrolled
 * past, hide again while the contact band or the footer is on screen — no point
 * floating a booking button over a booking card.
 */
export function useConversionVisibility(threshold: number) {
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  useEffect(() => {
    const targets = document.querySelectorAll('[data-conversion-zone]');
    if (!targets.length) return;

    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setAtContact(seen.size > 0);
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return past && !atContact;
}

/**
 * Desktop: a 56×56 vermilion button with the cut and a calendar — one tap to
 * book the free call. One stamp on first appearance — never a pulsing loop.
 */
export function FloatingBook({ tooltip, label }: { tooltip: string; label: string }) {
  const visible = useConversionVisibility(0.9);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'group fixed bottom-24 end-6 z-40 hidden transition-[opacity,transform] duration-[320ms] ease-mark md:block',
        'motion-reduce:transition-none',
        visible
          ? 'pointer-events-auto scale-100 opacity-100'
          : 'pointer-events-none translate-y-2 scale-90 opacity-0',
      )}
    >
      <a
        href={bookingHref()}
        aria-label={label}
        onClick={() => trackContact('booking', 'float')}
        tabIndex={visible ? undefined : -1}
        className="at-cut grid size-14 place-items-center bg-nuqta text-on-nuqta shadow-[var(--shadow-float)] transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5"
        style={{ '--cut': '14px' } as CSSProperties}
        {...bookingLinkProps}
      >
        <Icon name="calendar" size={24} />
      </a>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-1/2 end-full me-3 translate-y-1/2 whitespace-nowrap rounded-sm bg-carbon px-3 py-2 text-[12.5px] text-paper opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tooltip}
      </span>
    </div>
  );
}

/**
 * Mobile: a fixed 64px bar, Book a call primary and Email secondary, respecting
 * the safe-area inset. Replaces the float button below 768px.
 */
export function MobileContactBar({
  bookLabel,
  emailLabel,
}: {
  bookLabel: string;
  emailLabel: string;
}) {
  const visible = useConversionVisibility(0.4);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface transition-transform',
        'duration-[320ms] ease-mark motion-reduce:transition-none md:hidden',
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-16 grid-cols-2">
        <a
          href={bookingHref()}
          tabIndex={visible ? undefined : -1}
          onClick={() => trackContact('booking', 'mobile-bar')}
          className="flex items-center justify-center gap-2 bg-nuqta text-[15px] font-medium text-on-nuqta"
          {...bookingLinkProps}
        >
          <Icon name="calendar" size={20} />
          {bookLabel}
        </a>
        <a
          href={mailHref()}
          tabIndex={visible ? undefined : -1}
          onClick={() => trackContact('email', 'mobile-bar')}
          className="flex items-center justify-center gap-2 text-[15px] font-medium text-ink"
        >
          <Icon name="mail" size={20} />
          {emailLabel}
        </a>
      </div>
    </div>
  );
}
