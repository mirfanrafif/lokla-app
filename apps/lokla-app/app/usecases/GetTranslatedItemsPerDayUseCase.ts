import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { responseGetTranslatedItemsPerDaySchema } from '../data/models/ResponseGetTranslatedItemsPerDay';

export const useGetTranslatedItemsPerDay = (
  identifier: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['project', identifier, 'translatedItemsPerDay'],
    queryFn: async () => {
      const response = await getApiClient().get(
        `/translations/translated-itemms-per-day`,
        {
          params: {
            projectId: identifier,
          },
        }
      );

      const data = responseGetTranslatedItemsPerDaySchema.parse(response.data);

      return data;
    },
    enabled,
  });
};
