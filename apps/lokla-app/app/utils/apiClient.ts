import axios from 'axios';
import Cookies from 'js-cookie';
import { CookieKeys } from 'lib/constants/cookieKeys';

declare const window: any;

export const getApiClient = () => {
  const authData = Cookies.get(CookieKeys.User);

  const accessToken = authData ? JSON.parse(authData).accessToken : undefined;

  return axios.create({
    baseURL:
      typeof window !== 'undefined'
        ? window.ENV.API_BASE_URL
        : process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });
};
