import type { Locale } from '@/i18n/routing';
import { jsonLd } from '@/lib/seo';
import { siteGraph } from '@/lib/structured-data';

/** WebSite + Organization for the home page. Inner pages refer to the Organization by @id. */
export function SiteJsonLd({ locale }: { locale: Locale }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph(locale)) }} />;
}

export default SiteJsonLd;
