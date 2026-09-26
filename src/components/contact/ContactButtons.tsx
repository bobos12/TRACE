'use client';

import { useLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  contact,
  externalLinkProps,
  mailHref,
  phoneHref,
  trackContact,
  whatsappHref,
  type Placement,
} from '@/lib/contact';
import type { Locale } from '@/i18n/routing';

type Shared = {
  placement: Placement;
  /** Context appended to the prefilled WhatsApp message (page, service, project). */
  context?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  cut?: boolean;
  block?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * The primary conversion action. Always goes through whatsappHref() so the
 * message arrives prefilled and context-aware, and always fires trackContact().
 */
export function WhatsAppButton({
  placement,
  context,
  size = 'md',
  variant = 'primary',
  cut = true,
  block,
  className,
  children,
}: Shared) {
  const locale = useLocale() as Locale;

  return (
    <Button
      href={whatsappHref(locale, context)}
      variant={variant}
      size={size}
      cut={cut}
      block={block}
      icon="whatsapp"
      className={className}
      onClick={() => trackContact('whatsapp', placement)}
      {...externalLinkProps}
    >
      {children}
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
}: Omit<Shared, 'context'> & { showNumber?: boolean }) {
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
        // The margin sits on an outer span in the page's direction; on the
        // dir="ltr" number itself, inline-start is the wrong side in Arabic.
        <span className="ms-2 font-mono text-[13px] opacity-75">
          <span dir="ltr">{contact.phoneDisplay}</span>
        </span>
      ) : null}
    </Button>
  );
}

export function EmailButton({
  placement,
  size = 'md',
  variant = 'ghost',
  className,
  children,
  subject,
}: Omit<Shared, 'context' | 'cut' | 'block'> & { subject?: string }) {
  return (
    <Button
      href={mailHref(subject)}
      variant={variant}
      size={size}
      icon="mail"
      className={className}
      onClick={() => trackContact('email', placement)}
    >
      {children}
    </Button>
  );
}

/** Icon-only WhatsApp control, for the nav and tight spaces. */
export function WhatsAppIconButton({
  placement,
  context,
  label,
  className,
}: {
  placement: Placement;
  context?: string;
  label: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <a
      href={whatsappHref(locale, context)}
      aria-label={label}
      className={cn(
        'inline-grid size-10 place-items-center rounded-md border border-line-strong text-ink',
        'transition-colors duration-[160ms] ease-mark hover:border-ink hover:bg-surface-sunken',
        className,
      )}
      onClick={() => trackContact('whatsapp', placement)}
      {...externalLinkProps}
    >
      <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}

/** Icon-only phone control with the number in a tooltip. */
export function CallIconButton({
  placement,
  label,
  className,
}: {
  placement: Placement;
  label: string;
  className?: string;
}) {
  return (
    <span className="relative inline-flex group">
      <a
        href={phoneHref()}
        aria-label={`${label} ${contact.phoneDisplay}`}
        className={cn(
          'inline-grid size-10 place-items-center rounded-md border border-line-strong text-ink',
          'transition-colors duration-[160ms] ease-mark hover:border-ink hover:bg-surface-sunken',
          className,
        )}
        onClick={() => trackContact('phone', placement)}
      >
        <svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="square"
          strokeLinejoin="miter"
          aria-hidden="true"
        >
          <path d="M5 3.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4.5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z" />
        </svg>
      </a>
      <span
        role="tooltip"
        dir="ltr"
        className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-sm bg-surface-inverse px-2.5 py-1.5 font-mono text-[12px] text-ink-inverse opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {contact.phoneDisplay}
      </span>
    </span>
  );
}

export type { ButtonProps };
