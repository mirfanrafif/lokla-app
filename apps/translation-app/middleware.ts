import { isBefore } from 'date-fns';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { CookieKeys } from 'constants/cookieKeys';

import { buildTranslationProjectUrl } from './app/translation/navigations/translations.navigation';

const publicUrl = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/login',
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // redirect root url to translation list

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(
      new URL(buildTranslationProjectUrl(), request.url),
    );
  }

  if (publicUrl.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(CookieKeys.AccessToken) === undefined) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.cookies.get(CookieKeys.Expiry) === undefined) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const expiry = new Date(
    Number(request.cookies.get(CookieKeys.Expiry)?.value),
  );

  if (isBefore(expiry, new Date())) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
