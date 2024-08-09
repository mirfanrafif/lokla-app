import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { CookieKeys } from 'lib/constants/cookieKeys';

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ['current_user'],
    queryFn: async () => {
      const response = Cookies.get(CookieKeys.User);

      if (!response) {
        return null;
      }

      const data = JSON.parse(response);

      return data;
    },
  });

  return query;
};
