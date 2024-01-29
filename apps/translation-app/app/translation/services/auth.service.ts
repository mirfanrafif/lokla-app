import { cookies } from 'next/headers';

import { CookieKeys } from 'constants/cookieKeys';

import { LoginUserSchema } from '../../(auth)/models/ResponseLogin';

export const getAccessToken = () => {
  const accessToken = cookies().get(CookieKeys.AccessToken)?.value;

  return accessToken;
};

export const getCurrentUser = () => {
  const cookiesStore = cookies();

  const userCookies = cookiesStore.get(CookieKeys.User);

  if (userCookies === undefined) {
    return undefined;
  }

  const userData = LoginUserSchema.parse(JSON.parse(userCookies.value));

  return userData;
};

export const getRole = (): string | undefined => {
  const cookiesStore = cookies();

  const userCookies = cookiesStore.get('user');

  if (userCookies === undefined) {
    return undefined;
  }

  const userData = LoginUserSchema.parse(JSON.parse(userCookies.value));

  const role = userData.role;

  return role;
};
