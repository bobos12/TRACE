import { routing } from '@/i18n/routing';
import { contact } from '@/lib/contact-data';
import { getBailBonds, getLocalProjects, getLocalServices, getSite } from '@/lib/content';
import { siteUrl } from '@/lib/seo';
import { BRAND_DESCRIPTION, BRAND_NAME, SOCIAL_PROFILES } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * /llms.txt (llmstxt.org): a plain index of the site for AI engines, built
 * from content/ so it never drifts from the pages. Concept pieces and
 * placeholder booking links are left out.
 */
export function GET() {
  const locale = routing.defaultLocale;
  const site = getSite(locale);
  const pages = site.pages;
  const bail = getBailBonds();
  const hasBooking = !contact.booking.includes('REPLACE');
  const link = (name: string, path: string, note: string) => `- [${name}](${siteUrl(path)}): ${note}`;

  const lines = [
    `# ${BRAND_NAME}`,
    '',
    `> ${BRAND_DESCRIPTION}`,
    '',
    pages.about.seo.description,
    '',
    '## Contact',
    '',
    ...(hasBooking ? [`- Book a free 30-minute call: ${contact.booking}`] : []),
    `- Email: ${contact.email}`,
    `- Hours: ${contact.hours.en}. ${contact.responseTime.en}`,
    link('Contact page', '/contact', site.contactPage.lead),
    ...SOCIAL_PROFILES.map((url) => `- ${url}`),
    '',
    '## Services',
    '',
    link(pages.services.seo.title, '/services', pages.services.seo.description),
    ...getLocalServices(locale).map((s) => link(s.title, `/services/${s.slug}`, s.line)),
    '',
    '## Work',
    '',
    link(pages.work.seo.title, '/work', pages.work.seo.description),
    ...getLocalProjects(locale)
      .filter((p) => !p.placeholder)
      .map((p) => link(`${p.client}: ${p.title}`, `/work/${p.slug}`, p.summary)),
    '',
    '## Industries',
    '',
    link(bail.meta.title, '/bail-bonds', bail.meta.description),
    '',
    '## Company',
    '',
    link(pages.about.seo.title, '/about', pages.about.seo.description),
    link(site.footer.privacy, '/privacy', 'How we handle personal data.'),
    link(site.footer.terms, '/terms', 'Terms of use for this website.'),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
