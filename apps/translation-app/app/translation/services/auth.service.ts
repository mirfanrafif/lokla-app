import { cookies } from 'next/headers';
import { LoginUserSchema } from '../../(auth)/models/ResponseLogin';

export const getAccessToken = () => {
  const accessToken = cookies().get('access_token')?.value;

  return accessToken;
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
