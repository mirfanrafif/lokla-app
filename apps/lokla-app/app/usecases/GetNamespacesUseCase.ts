import { useSearchParams } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { ResponseGetTranslationNamespacesSchema } from '../data/models/ResponseGetNamespaces';

export const useGetNamespace = () => {
  const [searchParams] = useSearchParams();

  const query = useQuery({
    queryKey: ['project', searchParams.get('project'), 'namespaces'],
    queryFn: async () => {
      const response = await getApiClient().get('/translations/namespaces', {
        params: {
          project: searchParams.get('project'),
        },
      });

      const data = ResponseGetTranslationNamespacesSchema.parse(response.data);

      return data;
    },
  });

  return query;
};
