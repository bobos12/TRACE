'use client';

import { useLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { externalLinkProps, trackContact, whatsappHref, type Placement } from '@/lib/contact';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@/i18n/routing';

/**
 * The WhatsApp prompt used between sections — "Not sure what you need? Ask us
 * on WhatsApp →". A secondary button: outlined, so it never competes with the
 * section's own vermilion action, but unmistakably something to press — a
 * WhatsApp badge, a surface, a lift on hover.
 */
export function WhatsAppLink({
  placement,
  context,
  className,
  children,
}: {
  placement: Placement;
  context?: string;
  className?: string;
  children: ReactNode;
}) {
  const locale = useLocale() as Locale;

  return (
    <a
      href={whatsappHref(locale, context)}
      onClick={() => trackContact('whatsapp', placement)}
      className={cn(
        'group/wa inline-flex min-h-12 items-center gap-3 rounded-md border border-line-strong bg-surface-raised py-2 ps-2 pe-4',
        'text-[15px] font-medium text-ink',
        'transition-[border-color,transform] duration-[160ms] ease-mark hover:-translate-y-0.5 hover:border-ink active:translate-y-0',
        className,
      )}
      {...externalLinkProps}
    >
      <span className="grid size-8 flex-none place-items-center rounded-sm bg-nuqta text-on-nuqta">
        <Icon name="whatsapp" size={18} />
      </span>
      <span>{children}</span>
      <Icon
        name="arrow-right"
        size={16}
        className="text-ink-muted transition-[color,translate] duration-[160ms] ease-mark group-hover/wa:translate-x-1 group-hover/wa:text-ink rtl:group-hover/wa:-translate-x-1"
      />
    </a>
  );
}

export default WhatsAppLink;
