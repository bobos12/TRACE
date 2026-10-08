import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  // next-intl sends /en/* to /* with a 307. With one language and no prefix
  // that move is permanent, so search engines should consolidate on /*.
  if (response.status === 307 && response.headers.has('location')) {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Everything except API routes, share images (/og/), Next internals and files
  // with an extension. The dot needs a double backslash: '\.' in a JS string is
  // just '.', which made the lookahead exclude every path except '/'.
  matcher: '/((?!api|og/|_next|_vercel|.*\\..*).*)',
};
