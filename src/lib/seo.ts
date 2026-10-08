import type { Metadata } from 'next';
import { getSite } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { BRAND_NAME, SITE_URL, X_HANDLE } from '@/lib/site';

export { SITE_URL };

/** Absolute URL for a route. The home page is `https://…/`, everything else has no trailing slash. */
export const siteUrl = (path = '') => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
};

/** Canonical URL for a route (e.g. "/work"). One language, no prefix, no hreflang. */
export function alternatesFor(path = ''): Metadata['alternates'] {
  return { canonical: siteUrl(path) };
}

/** "Services | Trace Studio" — the brand once, at the end. */
export function pageTitle(title: string): string {
  return `${title} | ${BRAND_NAME}`;
}

/** JSON for a <script type="application/ld+json">, with `<` escaped so copy can't close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

interface PageMetaInput {
  locale: Locale;
  path?: string;
  /** The page's own title; the brand is appended. Omit on the home page. */
  title?: string;
  description?: string;
  /** Path of the share image; defaults to the home image. null = none. */
  image?: string | null;
  type?: 'website' | 'article';
  /** Keep the page out of the index (links are still followed). */
  noindex?: boolean;
}

export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  type = 'website',
  noindex = false,
}: PageMetaInput): Metadata {
  const site = getSite(locale);
  const resolvedTitle = title ? pageTitle(title) : site.meta.title;
  const resolvedDescription = description ?? site.meta.description;
  const resolvedImage = image === null ? null : siteUrl(image ?? site.meta.ogImage);

  return {
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    alternates: alternatesFor(path),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      siteName: BRAND_NAME,
      locale: 'en_US',
      url: siteUrl(path),
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage
        ? { images: [{ url: resolvedImage, width: 1200, height: 630, alt: resolvedTitle }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(X_HANDLE ? { site: X_HANDLE } : {}),
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
  };
}
