import { jwtDecode } from 'jwt-decode';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/forgot-password', whenAuthenticated: 'redirect' },
  { path: /^\/reset-password(?:\/.*)?$/, whenAuthenticated: 'redirect' },
  { path: '/pricing', whenAuthenticated: 'next' },
  { path: '/', whenAuthenticated: 'next' },
  { path: '/cart', whenAuthenticated: 'next' },
  { path: '/product-search', whenAuthenticated: 'next' },
  { path: /^\/product\//, whenAuthenticated: 'next' },
  { path: /^\/pedido\//, whenAuthenticated: 'next' },
  // { path: "/admin/aprove-orders", whenAuthenticated: "next" },
  { path: /^\/verify-email(?:\/.*)?$/, whenAuthenticated: 'next' },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

export function middleware(request: NextRequest) {
  const publicRoute = publicRoutes.find((route) =>
    typeof route.path === 'string'
      ? route.path === request.nextUrl.pathname
      : route.path.test(request.nextUrl.pathname)
  );
  const authToken = request.cookies.get('refreshToken')?.value;

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/';

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    if (!decodedToken.exp || decodedToken.exp < currentTime) {
      return NextResponse.redirect('/login');
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|gif)).*)',
  ],
};