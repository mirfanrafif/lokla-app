'use server';

import { CookieKeys } from '@constants/cookieKeys';
import { addDays } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { request } from '@apps/translation-app/lib/apiClient';
import { buildTranslationProjectUrl } from '../../translation/navigations/translations.navigation';
import { ResponseLoginSchema } from '../models/ResponseLogin';

export default async function login(requestData: string) {
  const cookieStore = cookies();

  const response = await request('/auth/login', {
    body: requestData,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = ResponseLoginSchema.parse(response);

  cookieStore.set(CookieKeys.AccessToken, data.accessToken, {
    sameSite: 'strict',
  });
  cookieStore.set(
    CookieKeys.Expiry,
    addDays(new Date(), 1).getTime().toString(),
    {
      sameSite: 'strict',
    },
  );
  cookieStore.set(CookieKeys.User, JSON.stringify(data.user), {
    sameSite: 'strict',
  });

  redirect(buildTranslationProjectUrl());
}
