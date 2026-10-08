import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

import '@/styles/globals.css';

import { routing, type Locale } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { getSite } from '@/lib/content';
import { BRAND_NAME, SITE_URL } from '@/lib/site';
import { ThemeScript } from '@/components/layout/ThemeScript';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F1E9' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0F0D' },
  ],
  colorScheme: 'light dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!hasLocale(routing.locales, raw)) return {};
  const site = getSite(raw as Locale);

  // Site-wide defaults only. The canonical URL and og:url are set per page, so
  // a route without its own metadata (404, styleguide) never claims to be home.
  return {
    metadataBase: new URL(SITE_URL),
    title: site.meta.title,
    description: site.meta.description,
    applicationName: BRAND_NAME,
    appleWebApp: { title: BRAND_NAME },
    openGraph: { type: 'website', siteName: BRAND_NAME, locale: 'en_US' },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
      other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#E0461F' }],
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!hasLocale(routing.locales, raw)) notFound();

  const locale = raw as Locale;
  setRequestLocale(locale);

  const site = getSite(locale);

  return (
    // The font variables go on <html>: the stacks in globals.css are built on
    // :root, and a var() there can only see what is set on the root itself.
    <html lang={locale} dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      {/* Extensions (ColorZilla, Grammarly…) write attributes onto <body>
          before React loads; don't report those as hydration mismatches.
          One level deep only — the page itself is still checked. */}
      <body suppressHydrationWarning>
        {/* Scroll-triggered reveals render at opacity 0 until motion runs.
            Without JS that would leave the page blank, so show everything. */}
        <noscript>
          <style>{'[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}'}</style>
        </noscript>

        <a href="#main" className="sr-only-focusable absolute start-4 top-4 z-50 bg-surface px-4 py-2">
          {site.ui.skipToContent}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>

        {/* The insights script is served by Vercel's edge; anywhere else it is
            a guaranteed 404 in the console. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
