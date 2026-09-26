'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { externalLinkProps, track, trackContact, whatsappTextHref, type Placement } from '@/lib/contact';

/**
 * One tap from "I need this" to a WhatsApp chat about it — the message is
 * already written with the service in it.
 *
 *   chip    the hero's "What do you need?" row
 *   button  the request button on each service tile
 *
 * Both outlined: they sit beside, not above, the vermilion primary action.
 */
export function WhatsAppRequest({
  message,
  service,
  placement,
  variant = 'button',
  className,
  children,
}: {
  /** The finished message, service included. */
  message: string;
  /** For analytics: which service was asked for. */
  service: string;
  placement: Placement;
  variant?: 'chip' | 'button';
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={whatsappTextHref(message)}
      onClick={() => {
        trackContact('whatsapp', placement);
        track('service_request', { service, placement });
      }}
      className={cn(
        'group/req inline-flex items-center border border-line-strong font-medium text-ink',
        'transition-[border-color,background-color,transform] duration-[160ms] ease-mark hover:border-ink hover:bg-surface-sunken',
        variant === 'chip'
          ? 'h-10 gap-2 rounded-sm px-3.5 text-[14px]'
          : 'h-10 gap-2.5 rounded-sm ps-2.5 pe-3.5 text-[13px] hover:-translate-y-0.5',
        className,
      )}
      {...externalLinkProps}
    >
      {variant === 'button' ? <Icon name="whatsapp" size={17} className="text-nuqta" /> : null}
      <span>{children}</span>
      {variant === 'chip' ? (
        <Icon
          name="arrow-up-right"
          size={14}
          className="text-ink-faint transition-colors duration-[160ms] ease-mark group-hover/req:text-nuqta"
        />
      ) : null}
    </a>
  );
}

export default WhatsAppRequest;
