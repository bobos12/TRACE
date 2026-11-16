import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/** Concept demos in public/demos/<name>/ that load public/demos/_shared/trace-demo.js. */
const CONCEPTS = ['steel-city'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 90 for case-study covers and galleries, where UI text must stay crisp.
    qualities: [75, 90],
  },
  // Baseline hardening. No full CSP: the theme script and JSON-LD are inline,
  // and a nonce would make every page dynamic.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
    ];
  },
  // The Ellison & Reyes demo is one static page with clean URLs
  // (/demos/ellison-reyes/pay); it routes itself with the History API.
  async rewrites() {
    return [
      { source: '/demos/ellison-reyes', destination: '/demos/ellison-reyes/index.html' },
      { source: '/demos/ellison-reyes/:page([a-z-]+)', destination: '/demos/ellison-reyes/index.html' },
      { source: '/demos/ironwood-bail-bonds', destination: '/demos/ironwood-bail-bonds/index.html' },
      // Concept demos: hash-routed inside, clean paths outside (public/demos/_shared/trace-demo.js).
      ...CONCEPTS.flatMap((name) => [
        { source: `/demos/${name}`, destination: `/demos/${name}/index.html` },
        { source: `/demos/${name}/:page([a-z-]+)`, destination: `/demos/${name}/index.html` },
      ]),
    ];
  },
  // Old links (index.html#pay) land on the clean URL; the page maps the hash.
  async redirects() {
    return [
      { source: '/demos/ellison-reyes/index.html', destination: '/demos/ellison-reyes', permanent: true },
      { source: '/demos/ironwood-bail-bonds/index.html', destination: '/demos/ironwood-bail-bonds', permanent: true },
      ...CONCEPTS.map((name) => ({ source: `/demos/${name}/index.html`, destination: `/demos/${name}`, permanent: true })),
    ];
  },
  experimental: {
    optimizePackageImports: ['motion'],
    // inlineCss was tried and reverted: the stylesheet is large enough that
    // inlining it pushed ~180KB into the document and delayed FCP more than
    // the saved round trip gained. See DECISIONS.md.
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
