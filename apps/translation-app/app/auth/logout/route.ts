import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  //logout logic
  cookies().delete('access_token');

  return NextResponse.redirect(new URL('/login', request.url));
}
