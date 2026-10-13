import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

/**
 * Crawlers named on purpose, so the policy is readable and each one can be
 * changed alone. All of them get the same rules as everyone else today.
 * Tokens from each provider's own docs (checked 2026-10-13):
 * developers.openai.com/api/docs/bots, support.claude.com (article 8896518),
 * docs.perplexity.ai/guides/bots, developers.google.com/search/docs/crawling-indexing/google-common-crawlers.
 */
const CRAWLERS = {
  /** Put pages in a search index, classic or AI. */
  search: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Applebot', 'DuckDuckBot'],
  /** Fetch a page because a person asked an assistant about it. Most ignore robots.txt anyway. */
  userTriggered: ['ChatGPT-User', 'Claude-User', 'Perplexity-User'],
  /**
   * Model training. Allowed: a new studio wants models to know it exists.
   * To opt out, give a token its own rule with `disallow: '/'` — search visibility is unaffected
   * (Google says so for Google-Extended; OpenAI and Anthropic split search and
   * training into separate bots).
   */
  training: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
} as const;

/** Paths no crawler needs. Pages that should stay out of search carry noindex
 *  instead, which Google can only read if it is allowed to fetch them. */
const DISALLOW = ['/api/'];

export default function robots(): MetadataRoute.Robots {
  const named = [...CRAWLERS.search, ...CRAWLERS.userTriggered, ...CRAWLERS.training];
  return {
    rules: [
      { userAgent: named, allow: '/', disallow: DISALLOW },
      { userAgent: '*', allow: '/', disallow: DISALLOW },
    ],
    sitemap: siteUrl('/sitemap.xml'),
  };
}
