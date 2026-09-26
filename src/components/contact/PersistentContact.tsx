'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import {
  contact,
  externalLinkProps,
  phoneHref,
  trackContact,
  whatsappHref,
} from '@/lib/contact';

/**
 * Visibility rule shared by both controls: appear once the hero has scrolled
 * past, hide again while the contact band or the footer is on screen — no point
 * floating a WhatsApp button over a WhatsApp card.
 */
function useConversionVisibility(threshold: number) {
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

const GLYPH = (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Desktop: a 56×56 carbon button with the cut, the WhatsApp glyph in its own
 * green. One stamp on first appearance — never a pulsing loop.
 */
export function FloatingWhatsApp({ tooltip, label }: { tooltip: string; label: string }) {
  const locale = useLocale() as Locale;
  const visible = useConversionVisibility(0.9);

  return (
        <div
          aria-hidden={!visible}
          className={cn(
            'group fixed bottom-6 end-6 z-40 hidden transition-[opacity,transform] duration-[320ms] ease-mark md:block',
            'motion-reduce:transition-none',
            visible
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none translate-y-2 scale-90 opacity-0',
          )}
        >
          <a
            href={whatsappHref(locale, 'floating button')}
            aria-label={label}
            onClick={() => trackContact('whatsapp', 'float')}
            tabIndex={visible ? undefined : -1}
            className="at-cut grid size-14 place-items-center bg-carbon text-[#25D366] shadow-[var(--shadow-float)] transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5"
            style={{ '--cut': '14px' } as CSSProperties}
            {...externalLinkProps}
          >
            {GLYPH}
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
 * Mobile: a fixed 64px bar, WhatsApp primary and Call secondary, respecting the
 * safe-area inset. Replaces the float button below 768px.
 */
export function MobileContactBar({
  whatsappLabel,
  callLabel,
}: {
  whatsappLabel: string;
  callLabel: string;
}) {
  const locale = useLocale() as Locale;
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
              href={whatsappHref(locale, 'mobile bar')}
              tabIndex={visible ? undefined : -1}
              onClick={() => trackContact('whatsapp', 'mobile-bar')}
              className="flex items-center justify-center gap-2 bg-nuqta text-[15px] font-medium text-on-nuqta"
              {...externalLinkProps}
            >
              <span className="size-5">{GLYPH}</span>
              {whatsappLabel}
            </a>
            <a
              href={phoneHref()}
              tabIndex={visible ? undefined : -1}
              onClick={() => trackContact('phone', 'mobile-bar')}
              aria-label={`${callLabel} ${contact.phoneDisplay}`}
              className="flex items-center justify-center gap-2 text-[15px] font-medium text-ink"
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
              {callLabel}
            </a>
          </div>
        </div>
  );
}
