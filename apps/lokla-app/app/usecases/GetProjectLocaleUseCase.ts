import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { ResponseGetLocalesSchema } from '../data/models/ResponseGetLocales';
import { useSearchParams } from '@remix-run/react';

export const useGetProjectLocales = () => {
  const [params] = useSearchParams();

  const query = useQuery({
    queryKey: ['project', params.get('project'), 'locales'],
    queryFn: async () => {
      const response = await getApiClient().get('/translations/locales', {
        params: {
          projectId: params.get('project'),
        },
      });

      const data = ResponseGetLocalesSchema.parse(response.data);

      return data;
    },
    enabled: !!params.get('project'),
  });

  return query;
};
