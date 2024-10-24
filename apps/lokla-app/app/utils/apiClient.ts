import axios from 'axios';
import Cookies from 'js-cookie';
import { CookieKeys } from 'lib/constants/cookieKeys';

// declare const window: any;

export const getApiClient = (accessToken?: string) => {
  return axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });
};
