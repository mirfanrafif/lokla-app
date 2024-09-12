import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';

export const action = async ({ request }: LoaderFunctionArgs) => {
  // If the user is already authenticated redirect to /projects directly
  return await authenticator.logout(request, {
    redirectTo: '/login',
  });
};
