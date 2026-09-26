/**
 * Self-hosted type. The three families are exposed as CSS variables
 * (--font-latin / --font-ar / --font-code) and composed into the token stacks
 * in src/styles/globals.css.
 *
 * All three are SIL Open Font License 1.1.
 */
import localFont from 'next/font/local';

/** Latin display and UI. One variable file covers 400–700. */
export const instrumentSans = localFont({
  src: '../../public/fonts/InstrumentSans-Variable.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-latin',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial'],
  adjustFontFallback: 'Arial',
});

/**
 * Arabic — two weights, not preloaded.
 *
 * Preloading was tried and measured: adding these ~86KB to the preload list
 * pushed mobile LCP from 2.84s to 3.37s on `/en` and 3.05s to 3.38s on `/ar`,
 * because on a throttled connection they compete with the HTML, CSS and JS on
 * the critical path. `font-display: swap` plus a metric-compatible fallback is
 * the better trade. See DECISIONS.md.
 *
 * 500 and 700 are not shipped — nothing uses them. A `font-weight: 500`
 * request on an Arabic eyebrow resolves to 400, which is the intent.
 */
export const plexSansArabic = localFont({
  src: [
    { path: '../../public/fonts/IBMPlexSansArabic-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-ar',
  preload: false,
  fallback: ['Segoe UI', 'Tahoma', 'Arial'],
  adjustFontFallback: false,
});

/** Numbers, eyebrows and codes. Not preloaded: small text, swap is invisible. */
export const plexMono = localFont({
  src: [
    { path: '../../public/fonts/IBMPlexMono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/IBMPlexMono-500.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-code',
  preload: false,
  fallback: ['ui-monospace', 'Menlo', 'Consolas', 'monospace'],
  adjustFontFallback: false,
});

export const fontVariables = [
  instrumentSans.variable,
  plexSansArabic.variable,
  plexMono.variable,
].join(' ');
