'use client';

import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Site } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import {
  contact,
  externalLinkProps,
  mailHref,
  phoneHref,
  trackContact,
  whatsappHref,
} from '@/lib/contact';

/**
 * The three contact cards — the only part of the contact band that needs the
 * client, because every link fires trackContact().
 *
 * The trace that draws itself around the WhatsApp card is a CSS animation
 * triggered by the shared reveal observer, not an animation library.
 */
export function ContactBandCards({
  site,
  locale,
  context,
}: {
  site: Site;
  locale: Locale;
  context?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1 · WhatsApp — the primary action. */}
      <div data-reveal="fade" className="relative">
        <a
          href={whatsappHref(locale, context)}
          onClick={() => trackContact('whatsapp', 'contact-band')}
          className="at-cut group/wa flex items-center gap-5 bg-nuqta p-7 text-on-nuqta transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5"
          style={{ '--cut': '28px' } as CSSProperties}
          {...externalLinkProps}
        >
          <Icon name="whatsapp" size={36} className="flex-none" />
          <span className="flex flex-col gap-1">
            <span className="heading-1">{site.cta.whatsapp}</span>
            <span className="body-sm opacity-85">{contact.responseTime[locale]}</span>
          </span>
          <Icon
            name="arrow-right"
            size={22}
            className="ms-auto flex-none transition-transform duration-[160ms] ease-mark group-hover/wa:translate-x-1 rtl:group-hover/wa:-translate-x-1"
          />
        </a>

        {/* The trace drawing itself around the card, once. */}
        <span
          aria-hidden="true"
          data-reveal="fade"
          className="at-card-trace pointer-events-none absolute inset-0"
        />
      </div>

      {/* 2 · Call. */}
      <div data-reveal="rise" style={{ '--d': '60ms' } as CSSProperties}>
        <a
          href={phoneHref()}
          onClick={() => trackContact('phone', 'contact-band')}
          className="group/call flex items-center gap-5 rounded-md border border-line-strong p-6 transition-colors duration-[160ms] ease-mark hover:border-ink"
        >
          <Icon name="phone" size={26} className="flex-none" />
          <span className="flex flex-col gap-1">
            <span className="heading-3">{site.cta.call}</span>
            <span className="font-mono text-[14px] text-ink-muted" dir="ltr">
              {contact.phoneDisplay}
            </span>
          </span>
          <Icon
            name="arrow-right"
            size={18}
            className="ms-auto flex-none text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/call:translate-x-1 rtl:group-hover/call:-translate-x-1"
          />
        </a>
      </div>

      {/* 3 · Email. */}
      <div data-reveal="rise" style={{ '--d': '100ms' } as CSSProperties}>
        <a
          href={mailHref(site.meta.title)}
          onClick={() => trackContact('email', 'contact-band')}
          className="group/mail flex items-center gap-4 rounded-md border border-line px-6 py-4 transition-colors duration-[160ms] ease-mark hover:border-ink"
        >
          <Icon name="mail" size={20} className="flex-none text-ink-muted" />
          <span className="body-sm text-ink-muted">{site.cta.email}</span>
          <span className="ms-auto font-mono text-[13px] text-ink" dir="ltr">
            {contact.email}
          </span>
        </a>
      </div>
    </div>
  );
}

export default ContactBandCards;
