import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');

    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow Playwright E2E tests to bypass auth when this env flag is set.
        if (process.env.PLAYWRIGHT_BYPASS_AUTH === '1') {
          return true;
        }

        const isLoginPage = req.nextUrl.pathname.startsWith('/login');
        if (isLoginPage) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - api/access (public lead capture API)
     * - access (public lead capture UI)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/access|access|_next/static|_next/image|favicon.ico).*)',
  ],
};
