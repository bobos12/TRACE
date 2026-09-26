import { defineRouting } from 'next-intl/routing';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
  // Both locales carry a prefix so /ar and /en are equal citizens and every
  // canonical URL is unambiguous for hreflang.
  localePrefix: 'always',
  localeDetection: true,
});

export const localeDir = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr');

export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar');

export const localeLabel: Record<Locale, string> = { ar: 'العربية', en: 'English' };

/**
 * Next 16 types route params as `{ locale: string }`, so every page takes the
 * wide type and narrows here. Unknown locales fall back to the default rather
 * than 404ing — the locale layout already 404s on a bad segment.
 */
export function readLocale(value: string): Locale {
  return (locales as readonly string[]).includes(value) ? (value as Locale) : routing.defaultLocale;
}
