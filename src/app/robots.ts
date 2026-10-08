import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only the API. Pages that should stay out of search (the styleguide,
        // sample projects) carry a noindex tag instead, which Google can only
        // read if it is allowed to fetch them.
        disallow: ['/api/'],
      },
    ],
    sitemap: siteUrl('/sitemap.xml'),
  };
}
