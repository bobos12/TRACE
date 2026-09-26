'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { track } from '@/lib/contact';
import { otherLocale, type Locale } from '@/i18n/routing';

/**
 * EN ⇄ العربية, keeping the same page and query. The label is the *other*
 * language written in its own script, so it reads natively either way.
 */
export function LangSwitch({
  label,
  variant = 'text',
  className,
}: {
  label: string;
  /** `button` matches the nav's bordered icon buttons; `text` is the footer link. */
  variant?: 'text' | 'button';
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const target = otherLocale(locale);
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      lang={target}
      disabled={pending}
      aria-label={`${label}`}
      onClick={() => {
        track('lang_switch', { from: locale, to: target });
        // Read the query at click time rather than with useSearchParams(), which
        // would opt the whole page out of static rendering.
        const query = window.location.search;
        startTransition(() => {
          router.replace(`${pathname}${query}`, { locale: target });
        });
      }}
      className={cn(
        'inline-flex h-10 items-center rounded-md text-[14px] transition-colors duration-[160ms] ease-mark',
        variant === 'button'
          ? 'border border-line-strong px-3 font-medium text-ink hover:border-ink hover:bg-surface-sunken'
          : 'px-2 text-ink-muted hover:text-ink',
        target === 'ar' ? 'font-arabic' : 'font-sans',
        className,
      )}
    >
      {label}
    </button>
  );
}

export default LangSwitch;
