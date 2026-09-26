import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The styleguide is a reference page, not content.
        disallow: ['/api/', '/ar/_styleguide', '/en/_styleguide'],
      },
    ],
    sitemap: siteUrl('/sitemap.xml'),
    host: siteUrl(''),
  };
}
