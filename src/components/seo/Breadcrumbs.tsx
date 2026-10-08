import { jsonLd, siteUrl } from '@/lib/seo';
import { BRAND_NAME } from '@/lib/site';

/**
 * BreadcrumbList JSON-LD for inner pages. Renders nothing visible — the visual
 * hierarchy is carried by the page hero, not by a breadcrumb trail.
 */
export function Breadcrumbs({
  trail,
}: {
  /** Ordered, excluding the home page. */
  trail: Array<{ name: string; path: string }>;
}) {
  const items = [{ name: BRAND_NAME, path: '/' }, ...trail].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: siteUrl(item.path),
  }));

  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
    />
  );
}

export default Breadcrumbs;
