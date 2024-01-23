import { cookies } from 'next/headers';

export const getAccessToken = () => {
  const accessToken = cookies().get('access_token')?.value;

  return accessToken;
};

export const getRole = (): string | undefined => {
  const cookiesStore = cookies();

  const userData = cookiesStore.get('user');

  if (userData === undefined) {
    return undefined;
  }

  const role = JSON.parse(userData.value).role;

  return role as string;
};
