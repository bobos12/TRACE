import type { MetadataRoute } from 'next';
import { getProjects, getServices } from '@/lib/content';
import { siteUrl } from '@/lib/seo';

/** Static routes. English only, no locale prefix. */
const STATIC_ROUTES = ['', '/services', '/work', '/about', '/contact', '/bail-bonds', '/privacy', '/terms'];

const PRIORITY: Record<string, number> = {
  '': 1,
  '/services': 0.9,
  '/work': 0.9,
  '/about': 0.7,
  '/contact': 0.8,
  '/bail-bonds': 0.8,
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

  return paths.map((path) => ({
    url: siteUrl(path),
    lastModified: now,
    changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: PRIORITY[path] ?? 0.6,
  }));
}
