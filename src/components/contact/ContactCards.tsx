'use client';

import { useLocale } from 'next-intl';
import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@/i18n/routing';
import { contact, externalLinkProps, phoneHref, trackContact, whatsappHref } from '@/lib/contact';

/**
 * The big WhatsApp card on the contact page. On desktop it carries a QR code,
 * generated at build time, that opens the same wa.me link — so someone at a
 * laptop can continue the conversation on their phone.
 */
export function WhatsAppCard({
  label,
  note,
  qrSvg,
  context,
}: {
  label: string;
  note: string;
  qrSvg: string;
  context?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <div
      className="at-cut flex items-center gap-6 bg-nuqta p-7 text-on-nuqta"
      style={{ '--cut': '28px' } as CSSProperties}
    >
      <div className="flex flex-1 flex-col gap-4">
        <Icon name="whatsapp" size={34} />
        <div className="flex flex-col gap-1.5">
          <a
            href={whatsappHref(locale, context)}
            onClick={() => trackContact('whatsapp', 'contact-page')}
            className="heading-1 after:absolute after:inset-0"
            {...externalLinkProps}
          >
            {label}
          </a>
          <p className="body-sm opacity-85">{note}</p>
        </div>
      </div>

      {/* The QR is decorative: the link beside it does the same job. */}
      <div
        aria-hidden="true"
        className="hidden size-[112px] shrink-0 bg-on-nuqta p-2 sm:block [&_svg]:size-full"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
    </div>
  );
}

export function CallCard({ label }: { label: string }) {
  return (
    <a
      href={phoneHref()}
      onClick={() => trackContact('phone', 'contact-page')}
      className="group/call flex items-center gap-5 rounded-md border border-line-strong p-6 transition-colors duration-[160ms] ease-mark hover:border-ink"
    >
      <Icon name="phone" size={26} className="flex-none text-ink" />
      <span className="flex flex-col gap-1">
        <span className="heading-3">{label}</span>
        <span className="font-mono text-[15px] text-ink-muted" dir="ltr">
          {contact.phoneDisplay}
        </span>
      </span>
      <Icon
        name="arrow-right"
        size={18}
        className="ms-auto flex-none text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/call:translate-x-1 rtl:group-hover/call:-translate-x-1"
      />
    </a>
  );
}
