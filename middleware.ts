import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CART_SESSION_COOKIE = 'CART_SESSION_ID';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get(CART_SESSION_COOKIE)) {
    response.cookies.set(CART_SESSION_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
