'use client';

import type { ReactNode } from 'react';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
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

type Shared = {
  placement: Placement;
  size?: ButtonSize;
  variant?: ButtonVariant;
  cut?: boolean;
  block?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * The primary conversion action: a free 30-minute call, booked straight into
 * the calendar. Always goes through bookingHref() and fires trackContact().
 */
export function BookCallButton({
  placement,
  size = 'md',
  variant = 'primary',
  cut = true,
  block,
  className,
  children,
}: Shared) {
  return (
    <Button
      href={bookingHref()}
      variant={variant}
      size={size}
      cut={cut}
      block={block}
      icon="calendar"
      className={className}
      onClick={() => trackContact('booking', placement)}
      {...bookingLinkProps}
    >
      {children}
    </Button>
  );
}

/** The second action. Email is how most US buyers start a conversation. */
export function EmailButton({
  placement,
  size = 'md',
  variant = 'secondary',
  cut = false,
  block,
  className,
  children,
  subject,
  showAddress = false,
}: Shared & { subject?: string; showAddress?: boolean }) {
  return (
    <Button
      href={mailHref(subject)}
      variant={variant}
      size={size}
      cut={cut}
      block={block}
      icon="mail"
      className={className}
      onClick={() => trackContact('email', placement)}
    >
      {children}
      {showAddress ? (
        <span className="ms-2 font-mono text-[13px] opacity-75">{contact.email}</span>
      ) : null}
    </Button>
  );
}

export function CallButton({
  placement,
  size = 'md',
  variant = 'secondary',
  cut = false,
  block,
  className,
  children,
  showNumber = false,
}: Shared & { showNumber?: boolean }) {
  if (!contact.phone) return null;
  return (
    <Button
      href={phoneHref()}
      variant={variant}
      size={size}
      cut={cut}
      block={block}
      icon="phone"
      className={className}
      onClick={() => trackContact('phone', placement)}
    >
      {children}
      {showNumber ? (
        <span className="ms-2 font-mono text-[13px] opacity-75">{contact.phoneDisplay}</span>
      ) : null}
    </Button>
  );
}

const iconButton =
  'inline-grid size-10 place-items-center rounded-md border border-line-strong text-ink transition-colors duration-[160ms] ease-mark hover:border-ink hover:bg-surface-sunken';

/** Icon-only booking control, for the mobile nav. */
export function BookIconButton({
  placement,
  label,
  className,
}: {
  placement: Placement;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={bookingHref()}
      aria-label={label}
      className={cn(iconButton, className)}
      onClick={() => trackContact('booking', placement)}
      {...bookingLinkProps}
    >
      <Icon name="calendar" size={20} />
    </a>
  );
}

/** Icon-only email control with the address in a tooltip. */
export function EmailIconButton({
  placement,
  label,
  className,
}: {
  placement: Placement;
  label: string;
  className?: string;
}) {
  return <ContactIcon href={mailHref()} icon="mail" channel="email" tip={contact.email} {...{ placement, label, className }} />;
}

function ContactIcon({
  href,
  icon,
  channel,
  tip,
  placement,
  label,
  className,
}: {
  href: string;
  icon: IconName;
  channel: 'email' | 'phone';
  tip: string;
  placement: Placement;
  label: string;
  className?: string;
}) {
  return (
    <span className="group relative inline-flex">
      <a
        href={href}
        aria-label={`${label} ${tip}`}
        className={cn(iconButton, className)}
        onClick={() => trackContact(channel, placement)}
      >
        <Icon name={icon} size={20} />
      </a>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-surface-inverse px-2.5 py-1.5 font-mono text-[12px] text-ink-inverse opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}

export type { ButtonProps };
