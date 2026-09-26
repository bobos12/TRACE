import type { MetadataRoute } from 'next';
import { getProjects, getServices } from '@/lib/content';
import { locales } from '@/i18n/routing';
import { siteUrl } from '@/lib/seo';

/** Static routes, without a locale prefix. */
const STATIC_ROUTES = ['', '/services', '/work', '/about', '/contact', '/privacy', '/terms'];

const PRIORITY: Record<string, number> = {
  '': 1,
  '/services': 0.9,
  '/work': 0.9,
  '/about': 0.7,
  '/contact': 0.8,
  '/privacy': 0.3,
  '/terms': 0.3,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_ROUTES,
    ...getServices().map((s) => `/services/${s.slug}`),
    ...getProjects().map((p) => `/work/${p.slug}`),
  ];

  const now = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: siteUrl(`/${locale}${path}`),
      lastModified: now,
      changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: PRIORITY[path] ?? 0.6,
      // Every URL declares its alternates, so Google sees the pair.
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, siteUrl(`/${l}${path}`)])),
      },
    })),
  );
}
