import { defineRouting } from 'next-intl/routing';

/**
 * English only. The [locale] segment and next-intl stay so a second language
 * can come back without restructuring the app; with `localePrefix: 'never'`
 * the URLs carry no /en — the proxy rewrites / to /en internally.
 */
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'never',
  localeDetection: false,
  // No alternate languages to announce.
  alternateLinks: false,
});

/**
 * Next 16 types route params as `{ locale: string }`, so every page takes the
 * wide type and narrows here.
 */
export function readLocale(value: string): Locale {
  return (locales as readonly string[]).includes(value) ? (value as Locale) : routing.defaultLocale;
}
