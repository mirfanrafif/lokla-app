import { useSearchParams } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { ResponseGetTranslationDataSchema } from '../data/models/ResponseGetTranslationData';

export const useGetTranslationsData = () => {
  const [searchParams] = useSearchParams();

  const query = useQuery({
    queryKey: [
      'project',
      searchParams.get('project'),
      'translations',
      {
        page: searchParams.get('page') ?? 0,
        limit: searchParams.get('limit') ?? 15,
        search: searchParams.get('search') ?? '',
        filter: searchParams.get('filter'),
      },
    ],
    queryFn: async () => {
      const response = await getApiClient().get('/translations', {
        params: {
          project: searchParams.get('project'),
          page: searchParams.get('page') ?? 0,
          limit: searchParams.get('limit') ?? 15,
          search: searchParams.get('search') ?? '',
          filter: searchParams.get('filter'),
        },
      });

      const data = ResponseGetTranslationDataSchema.parse(response.data);

      return data;
    },
  });

  return query;
};
