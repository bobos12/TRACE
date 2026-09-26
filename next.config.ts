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
  experimental: {
    optimizePackageImports: ['motion'],
    // inlineCss was tried and reverted: the stylesheet is large enough that
    // inlining it pushed ~180KB into the document and delayed FCP more than
    // the saved round trip gained. See DECISIONS.md.
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
