'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { bookingHref, bookingLinkProps, trackContact, type Placement } from '@/lib/contact';
import { Icon } from '@/components/ui/Icon';

/**
 * The booking prompt used between sections — "Not sure what you need? Book a
 * free call →". A secondary button: outlined, so it never competes with the
 * section's own vermilion action, but unmistakably something to press — a
 * calendar badge, a surface, a lift on hover.
 */
export function BookingLink({
  placement,
  className,
  children,
}: {
  placement: Placement;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={bookingHref()}
      onClick={() => trackContact('booking', placement)}
      className={cn(
        'group/bk inline-flex min-h-12 items-center gap-3 rounded-md border border-line-strong bg-surface-raised py-2 ps-2 pe-4',
        'text-[15px] font-medium text-ink',
        'transition-[border-color,transform] duration-[160ms] ease-mark hover:-translate-y-0.5 hover:border-ink active:translate-y-0',
        className,
      )}
      {...bookingLinkProps}
    >
      <span className="grid size-8 flex-none place-items-center rounded-sm bg-nuqta text-on-nuqta">
        <Icon name="calendar" size={18} />
      </span>
      <span>{children}</span>
      <Icon
        name="arrow-right"
        size={16}
        className="text-ink-muted transition-[color,translate] duration-[160ms] ease-mark group-hover/bk:translate-x-1 group-hover/bk:text-ink"
      />
    </a>
  );
}

export default BookingLink;
