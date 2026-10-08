import type { MetadataRoute } from 'next';
import { getProjects, getServices } from '@/lib/content';
import { siteUrl } from '@/lib/seo';

/** Static routes. English only, no locale prefix. */
const STATIC_ROUTES = ['/', '/services', '/work', '/about', '/contact', '/bail-bonds', '/privacy', '/terms'];

const PRIORITY: Record<string, number> = {
  '/': 1,
  '/services': 0.9,
  '/work': 0.9,
  '/about': 0.7,
  '/contact': 0.8,
  '/bail-bonds': 0.8,
  '/privacy': 0.3,
  '/terms': 0.3,
};

/**
 * Every indexable page, once. Sample projects are noindex and left out.
 * No lastmod: a build timestamp on every URL tells Google nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_ROUTES,
    ...getServices().map((s) => `/services/${s.slug}`),
    ...getProjects()
      .filter((p) => !p.placeholder)
      .map((p) => `/work/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: siteUrl(path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: PRIORITY[path] ?? 0.6,
  }));
}
