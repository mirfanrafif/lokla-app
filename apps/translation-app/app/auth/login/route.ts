
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { CookieKeys } from 'constants/cookieKeys';

import { request } from '@apps/translation-app/lib/apiClient';
import { ResponseLoginSchema } from '../../(auth)/models/ResponseLogin';
import { addDays } from 'date-fns';

export async function POST(params: NextRequest) {
  try {
    const requestData = await params.json();
    const cookieStore = cookies();

    const response = await request('/auth/login', {
      body: JSON.stringify(requestData),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = ResponseLoginSchema.parse(response);

    cookieStore.set(CookieKeys.AccessToken, data.accessToken, {
      sameSite: 'strict',
    });
    cookieStore.set(CookieKeys.Expiry, addDays(new Date(), 1).getTime().toString(), {
      sameSite: 'strict',
    });
    cookieStore.set(CookieKeys.User, JSON.stringify(data.user), {
      sameSite: 'strict',
    });

    return NextResponse.json({
      success: true,
      access_token: data.accessToken,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as { message: string }).message,
      },
      {
        status: 401,
      },
    );
  }
}
