'use client';

import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import {
  bookingHref,
  bookingLinkProps,
  contact,
  mailHref,
  phoneHref,
  trackContact,
  type Placement,
} from '@/lib/contact';

const arrow = 'ms-auto flex-none transition-transform duration-[160ms] ease-mark';

/**
 * The primary card: book the free call. Vermilion with the cut — the one
 * loud thing in the contact band and on the contact page.
 */
export function BookCard({
  label,
  note,
  placement,
  trace = false,
}: {
  label: string;
  note: string;
  placement: Placement;
  /** Draw the trace around the card once when it enters view. */
  trace?: boolean;
}) {
  return (
    <div data-reveal={trace ? 'fade' : undefined} className="relative">
      <a
        href={bookingHref()}
        onClick={() => trackContact('booking', placement)}
        className="at-cut group/bk flex items-center gap-5 bg-nuqta p-7 text-on-nuqta transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5"
        style={{ '--cut': '28px' } as CSSProperties}
        {...bookingLinkProps}
      >
        <Icon name="calendar" size={36} className="flex-none" />
        <span className="flex flex-col gap-1">
          <span className="heading-1">{label}</span>
          <span className="body-sm opacity-85">{note}</span>
        </span>
        <Icon name="arrow-right" size={22} className={cn(arrow, 'group-hover/bk:translate-x-1')} />
      </a>

      {trace ? (
        <span
          aria-hidden="true"
          data-reveal="fade"
          className="at-card-trace pointer-events-none absolute inset-0"
        />
      ) : null}
    </div>
  );
}

/** The second card: email, with the address shown — people trust a real inbox. */
export function EmailCard({
  label,
  subject,
  placement,
}: {
  label: string;
  subject?: string;
  placement: Placement;
}) {
  return (
    <a
      href={mailHref(subject)}
      onClick={() => trackContact('email', placement)}
      className="group/mail flex items-center gap-5 rounded-md border border-line-strong p-6 transition-colors duration-[160ms] ease-mark hover:border-ink"
    >
      <Icon name="mail" size={26} className="flex-none" />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="heading-3">{label}</span>
        <span className="truncate font-mono text-[14px] text-ink-muted">{contact.email}</span>
      </span>
      <Icon
        name="arrow-right"
        size={18}
        className={cn(arrow, 'text-ink-muted group-hover/mail:translate-x-1')}
      />
    </a>
  );
}

/** The phone line, quiet — for those who prefer to call. */
export function CallRow({ callLabel, placement }: { callLabel: string; placement: Placement }) {
  return (
    <a
      href={phoneHref()}
      onClick={() => trackContact('phone', placement)}
      aria-label={`${callLabel} ${contact.phoneDisplay}`}
      className="flex items-center gap-3 rounded-md border border-line px-5 py-4 transition-colors duration-[160ms] ease-mark hover:border-ink"
    >
      <Icon name="phone" size={20} className="flex-none text-ink-muted" />
      <span className="body-sm text-ink">{callLabel}</span>
      <span className="ms-auto font-mono text-[13px] text-ink-muted">{contact.phoneDisplay}</span>
    </a>
  );
}
