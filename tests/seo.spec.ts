import { expect, test, type Page } from '@playwright/test';

/**
 * Technical SEO invariants for trace-studio.tech, checked on the production
 * build with JavaScript off. The expected values are written out here on
 * purpose: if src/lib/site.ts or the content drifts, these fail.
 */

const ORIGIN = 'https://trace-studio.tech';
const BRAND = 'Trace Studio';
const HOME_TITLE = 'Trace Studio | Digital Products, Websites & Software';
const HOME_DESCRIPTION =
  'Trace Studio is a digital studio building premium websites, software products, business systems, and digital experiences.';

/** Pages that must be indexable, with a self-referencing canonical. */
const INDEXABLE = [
  '/',
  '/services',
  '/work',
  '/about',
  '/contact',
  '/bail-bonds',
  '/privacy',
  '/terms',
  '/services/websites-web-apps',
  '/work/trace-bail',
];

/** Pages that must stay out of the index. */
const NOINDEX = ['/_styleguide', '/work/clearwater-dental'];

/** Hosts that must never appear in metadata or structured data. */
const FORBIDDEN = [/localhost/i, /127\.0\.0\.1/, /vercel\.app/i, /\btrace\.studio\b/i, /http:\/\/trace-studio/i, /www\.trace-studio/i];

/** A production URL → the same path on the test server. */
const local = (url: string) => url.replace(ORIGIN, '');

/** Same URL, ignoring the optional slash on the bare origin. */
const norm = (url: string) => new URL(url).href;

async function head(page: Page) {
  const attr = (selector: string, name: string) =>
    page.locator(selector).evaluateAll((els, n) => els.map((el) => el.getAttribute(n) ?? ''), name);
  return {
    titles: await page.locator('head title').allTextContents(),
    descriptions: await attr('meta[name="description"]', 'content'),
    canonicals: await attr('link[rel="canonical"]', 'href'),
    robots: await attr('meta[name="robots"]', 'content'),
    ogUrl: await attr('meta[property="og:url"]', 'content'),
    ogTitle: await attr('meta[property="og:title"]', 'content'),
    ogDescription: await attr('meta[property="og:description"]', 'content'),
    ogImage: await attr('meta[property="og:image"]', 'content'),
    ogSiteName: await attr('meta[property="og:site_name"]', 'content'),
    ogLocale: await attr('meta[property="og:locale"]', 'content'),
    twitterCard: await attr('meta[name="twitter:card"]', 'content'),
    h1: await page.locator('h1').allTextContents(),
    jsonLd: (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      (text) => JSON.parse(text) as unknown,
    ),
  };
}

/** Flatten JSON-LD (arrays and @graph) into a list of nodes. */
function nodes(data: unknown[]): Record<string, unknown>[] {
  return data.flatMap((d) => {
    const list = Array.isArray(d) ? d : [d];
    return list.flatMap((n: Record<string, unknown>) =>
      Array.isArray(n['@graph']) ? (n['@graph'] as Record<string, unknown>[]) : [n],
    );
  });
}

const types = (n: Record<string, unknown>) => ([] as unknown[]).concat(n['@type']);

test.describe('indexable pages', () => {
  for (const path of INDEXABLE) {
    test(`${path} has complete, self-referencing metadata`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      const h = await head(page);

      expect(h.titles).toHaveLength(1);
      expect(h.titles[0]).toContain(BRAND);
      // The brand once, not "Trace Studio | … | Trace Studio".
      expect(h.titles[0]!.split(BRAND)).toHaveLength(2);
      expect(h.descriptions).toHaveLength(1);
      expect(h.descriptions[0]!.length).toBeGreaterThan(50);

      expect(h.canonicals).toHaveLength(1);
      expect(norm(h.canonicals[0]!)).toBe(norm(`${ORIGIN}${path}`));
      expect(h.robots.join(' ')).not.toMatch(/noindex/);

      expect(h.ogUrl).toEqual(h.canonicals);
      expect(h.ogTitle).toEqual(h.titles);
      expect(h.ogDescription).toHaveLength(1);
      expect(h.ogSiteName).toEqual([BRAND]);
      expect(h.ogLocale).toEqual(['en_US']);
      expect(h.twitterCard).toEqual(['summary_large_image']);

      expect(h.h1).toHaveLength(1);
      expect(h.h1[0]!.trim().length).toBeGreaterThan(0);
    });
  }

  test('titles and descriptions are unique', async ({ page }) => {
    const titles: string[] = [];
    const descriptions: string[] = [];
    for (const path of INDEXABLE) {
      await page.goto(path);
      const h = await head(page);
      titles.push(h.titles[0]!);
      descriptions.push(h.descriptions[0]!);
    }
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  test('share images resolve without a redirect', async ({ page, request }) => {
    for (const path of ['/', '/work/trace-bail']) {
      await page.goto(path);
      const [image] = (await head(page)).ogImage;
      expect(image).toMatch(new RegExp(`^${ORIGIN}/`));
      const response = await request.get(local(image!), { maxRedirects: 0 });
      expect(response.status(), image).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^image\//);
    }
  });
});

test.describe('home page', () => {
  test('title, description and h1 carry the brand and category', async ({ page }) => {
    await page.goto('/');
    const h = await head(page);
    expect(h.titles).toEqual([HOME_TITLE]);
    expect(h.descriptions).toEqual([HOME_DESCRIPTION]);
    expect(h.h1[0]).toContain(BRAND);
  });

  test('WebSite and Organization structured data', async ({ page, request }) => {
    await page.goto('/');
    const all = nodes((await head(page)).jsonLd);

    const websites = all.filter((n) => types(n).includes('WebSite'));
    const orgs = all.filter((n) => types(n).includes('Organization') && n.name);
    expect(websites).toHaveLength(1);
    expect(orgs).toHaveLength(1);

    const website = websites[0]!;
    const org = orgs[0]!;
    expect(website).toMatchObject({ name: BRAND, alternateName: 'Trace', url: `${ORIGIN}/` });
    expect(org).toMatchObject({
      name: BRAND,
      alternateName: 'Trace',
      url: `${ORIGIN}/`,
      description: HOME_DESCRIPTION,
    });
    expect((website.publisher as { '@id': string })['@id']).toBe(org['@id']);

    // No invented contact or legal facts.
    for (const key of ['telephone', 'address', 'foundingDate', 'numberOfEmployees', 'award']) {
      expect(org, key).not.toHaveProperty(key);
    }

    const logo = org.logo as { url: string };
    expect(logo.url).toMatch(new RegExp(`^${ORIGIN}/`));
    expect((await request.get(local(logo.url))).status()).toBe(200);

    for (const url of (org.sameAs as string[] | undefined) ?? []) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toContain('REPLACE');
    }
  });

  test('the main sections are in the server HTML', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2')).not.toHaveCount(0);
    for (const href of ['/services', '/work', '/contact']) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
    }
  });
});

test.describe('contact channels and icons', () => {
  for (const path of INDEXABLE) {
    test(`${path} has no WhatsApp contact links`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      expect(html).not.toMatch(/wa\.me\/|api\.whatsapp\.com/);
    });
  }

  test('every declared favicon loads', async ({ page, request }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      expect(response.headers()['content-type'], href).toMatch(/^image\//);
    }
  });
});

test.describe('structured data across the site', () => {
  for (const path of INDEXABLE) {
    test(`${path} JSON-LD is valid and points at production`, async ({ page }) => {
      await page.goto(path);
      const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const text of raw) {
        const data = JSON.parse(text) as unknown;
        for (const node of nodes([data])) {
          expect(node['@type'], text).toBeTruthy();
        }
        for (const re of FORBIDDEN) expect(text, re.source).not.toMatch(re);
      }
      // The Organization node lives on the home page only.
      if (path !== '/') {
        const full = nodes(raw.map((t) => JSON.parse(t) as unknown)).filter(
          (n) => types(n).includes('Organization') && n.logo,
        );
        expect(full).toHaveLength(0);
      }
    });
  }
});

test.describe('no stray hosts in metadata', () => {
  for (const path of INDEXABLE) {
    test(`${path} head`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      const headHtml = html.slice(0, html.indexOf('</head>'));
      for (const re of FORBIDDEN) expect(headHtml, re.source).not.toMatch(re);
    });
  }
});

test.describe('noindex pages', () => {
  for (const path of NOINDEX) {
    test(`${path} is noindex and claims no other canonical`, async ({ page }) => {
      await page.goto(path);
      const h = await head(page);
      expect(h.robots.join(' ')).toMatch(/noindex/);
      for (const canonical of h.canonicals) expect(norm(canonical)).toBe(norm(`${ORIGIN}${path}`));
    });
  }

  test('an unknown URL is a 404, noindex, with no canonical', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    const h = await head(page);
    expect(h.robots.join(' ')).toMatch(/noindex/);
    expect(h.canonicals).toHaveLength(0);
  });
});

test.describe('robots.txt and sitemap.xml', () => {
  test('robots.txt allows crawling and names the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/^Allow: \/$/m);
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(body).not.toMatch(/^Disallow: \/$/m);
    expect(body).not.toMatch(/^Disallow: \/(_next|images|fonts|og)/m);
  });

  test('sitemap lists every indexable page once, on the production origin', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const locs = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]!);

    expect(locs.length).toBeGreaterThan(10);
    expect(new Set(locs).size).toBe(locs.length);
    for (const loc of locs) expect(loc).toMatch(new RegExp(`^${ORIGIN}(/|/[a-z0-9-/]*[a-z0-9])$`));
    for (const path of INDEXABLE) expect(locs.map(norm)).toContain(norm(`${ORIGIN}${path}`));
    for (const path of NOINDEX) expect(locs.map(norm)).not.toContain(norm(`${ORIGIN}${path}`));
  });

  test('every sitemap URL is live, indexable and canonical to itself', async ({ page, request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]!);
    for (const loc of locs) {
      const response = await page.goto(local(loc) || '/');
      expect(response?.status(), loc).toBe(200);
      const h = await head(page);
      expect(h.robots.join(' '), loc).not.toMatch(/noindex/);
      expect(h.canonicals.map(norm), loc).toEqual([norm(loc)]);
    }
  });
});

test.describe('one URL per page', () => {
  test('the /en prefix redirects permanently', async ({ request }) => {
    const response = await request.get('/en/about', { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(/\/about$/);
  });

  test('a trailing slash redirects permanently', async ({ request }) => {
    const response = await request.get('/about/', { maxRedirects: 0 });
    expect(response.status()).toBe(308);
  });

  test('query strings keep the clean canonical', async ({ page }) => {
    await page.goto('/work?kind=client');
    const h = await head(page);
    expect(h.canonicals).toEqual([`${ORIGIN}/work`]);
  });
});
