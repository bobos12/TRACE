'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { mailHref, track, trackContact, type Placement } from '@/lib/contact';

/**
 * One tap from "I need this" to an email about it — the subject line is
 * already written with the service in it.
 *
 * Outlined: it sits beside, not above, the vermilion primary action.
 */
export function ServiceRequest({
  subject,
  service,
  placement,
  className,
  children,
}: {
  /** The finished subject line, service included. */
  subject: string;
  /** For analytics: which service was asked for. */
  service: string;
  placement: Placement;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={mailHref(subject)}
      onClick={() => {
        trackContact('email', placement);
        track('service_request', { service, placement });
      }}
      className={cn(
        'inline-flex h-10 items-center gap-2.5 rounded-sm border border-line-strong ps-2.5 pe-3.5 text-[13px] font-medium text-ink',
        'transition-[border-color,background-color,transform] duration-[160ms] ease-mark hover:-translate-y-0.5 hover:border-ink hover:bg-surface-sunken',
        className,
      )}
    >
      <Icon name="mail" size={17} className="text-nuqta" />
      <span>{children}</span>
    </a>
  );
}

export default ServiceRequest;
