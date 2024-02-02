import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { CookieKeys } from 'constants/cookieKeys';

import { buildTranslationListUrl } from './app/translation/navigations/translations.navigation';
import { isBefore } from 'date-fns';

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
      new URL(buildTranslationListUrl(), request.url),
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

  const expiry = new Date(request.cookies.get('expiry')?.value as string);
  
  if (isBefore(expiry, new Date())) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
