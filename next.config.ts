import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

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
  experimental: {
    optimizePackageImports: ['motion'],
    // inlineCss was tried and reverted: the stylesheet is large enough that
    // inlining it pushed ~180KB into the document and delayed FCP more than
    // the saved round trip gained. See DECISIONS.md.
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
