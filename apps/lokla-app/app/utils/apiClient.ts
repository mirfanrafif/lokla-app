import axios from 'axios';
import Cookies from 'js-cookie';

declare const window: any;

export const getApiClient = () => {
  const authData = Cookies.get('lokla_auth_data');

  const accessToken = authData ? JSON.parse(authData).accessToken : undefined;

  return axios.create({
    baseURL:
      typeof window !== 'undefined'
        ? `${window.ENV.API_BASE_URL}/api`
        : `${process.env.API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });
};
