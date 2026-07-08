import { NextResponse } from 'next/server';
import { auth } from './app/_lib/auth';

export default auth(async (req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;

  // Protect /admin/*: must be logged in AND have admin role
  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const role = session.user.role;
    if (role !== 'admin' && role !== 'superadmin') {
      // Authenticated but not admin → redirect to account
      return NextResponse.redirect(new URL('/account', req.url));
    }
  }

  // Protect /account/*: must be logged in
  if (pathname.startsWith('/account')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
