/**
 * Self-hosted type. The two families are exposed as CSS variables
 * (--font-latin / --font-code) and composed into the token stacks in
 * src/styles/globals.css. The site is English-only, so IBM Plex Sans Arabic is
 * no longer loaded (the files stay in public/fonts/ for brand material).
 *
 * Both are SIL Open Font License 1.1.
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

export const fontVariables = [instrumentSans.variable, plexMono.variable].join(' ');
