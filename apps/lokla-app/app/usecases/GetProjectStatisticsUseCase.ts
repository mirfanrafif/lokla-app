import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { ResponseGetStatisticsSchema } from '../data/models/ResponseGetStatistics';

export const useGetProjectStatistics = (
  identifier: string,
  enabled: boolean
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['project', identifier, 'statistics'],
    queryFn: async () => {
      const response = await getApiClient().get(`/translations/statistics`, {
        params: {
          project: identifier,
        },
      });

      const data = ResponseGetStatisticsSchema.parse(response.data);

      return data;
    },
    enabled,
  });
};
