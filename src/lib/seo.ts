import type { Metadata } from 'next';
import { getSite } from '@/lib/content';
import { locales, type Locale } from '@/i18n/routing';

/**
 * The canonical origin. An env var set but left empty (easy to do in the
 * Vercel dashboard) must fall back too — `??` alone let '' through and
 * `new URL('')` failed the whole build. A bare domain gets https:// added.
 */
function resolveSiteUrl(fallback = 'https://athr.studio'): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();
  if (!raw) return fallback;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate).toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();

export const siteUrl = (path = '') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** hreflang for a route, given without the locale prefix (e.g. "/work"). */
export function alternatesFor(locale: Locale, path = ''): Metadata['alternates'] {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = siteUrl(`/${l}${clean}`);
  languages['x-default'] = siteUrl(`/ar${clean}`);

  return { canonical: siteUrl(`/${locale}${clean}`), languages };
}

interface PageMetaInput {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  /** null = this route has an opengraph-image file; let Next supply the URL. */
  image?: string | null;
  type?: 'website' | 'article';
}

export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  type = 'website',
}: PageMetaInput): Metadata {
  const site = getSite(locale);
  const resolvedTitle = title ? `${title} — ATHR` : site.meta.title;
  const resolvedDescription = description ?? site.meta.description;
  const resolvedImage = image === null ? null : siteUrl(image ?? site.meta.ogImage);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type,
      siteName: 'ATHR',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
      url: siteUrl(`/${locale}${path === '/' ? '' : path}`),
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage
        ? { images: [{ url: resolvedImage, width: 1200, height: 630, alt: resolvedTitle }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
  };
}
