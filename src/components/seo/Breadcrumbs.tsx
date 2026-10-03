import { siteUrl } from '@/lib/seo';

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
  const items = [{ name: 'TRACE', path: '' }, ...trail].map((item, i) => ({
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default Breadcrumbs;
