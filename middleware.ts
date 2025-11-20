import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (pathname.startsWith('/api/auth')) return NextResponse.next();
  if (pathname === '/login') return NextResponse.next();
  if (pathname.startsWith('/_next')) return NextResponse.next();
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const token = req.cookies.get('auth_token')?.value;

  // If there's no token cookie, redirect to login. We avoid
  // server-side JWT verification here because Next.js middleware
  // runs in the Edge runtime where some Node libs (like
  // `jsonwebtoken`) are incompatible. API routes should verify
  // the token when needed.
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
