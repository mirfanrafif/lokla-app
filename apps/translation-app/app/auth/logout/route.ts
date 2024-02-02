import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { CookieKeys } from 'constants/cookieKeys';

export async function GET(request: NextRequest) {
  //logout logic
  cookies().delete(CookieKeys.AccessToken);
  cookies().delete(CookieKeys.Expiry);
  cookies().delete(CookieKeys.User);

  return NextResponse.redirect(new URL('/login', request.url));
}
