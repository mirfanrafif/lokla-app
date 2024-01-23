import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { request } from '@apps/translation-app/lib/apiClient';

export async function POST(params: NextRequest) {
  try {
    const requestData = await params.json();
    const cookieStore = cookies();

    const data = await request('/auth/login', {
      body: JSON.stringify(requestData),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    cookieStore.set('access_token', data.accessToken, {
      secure: true,
    });
    cookieStore.set('user', JSON.stringify(data.user));

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
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
