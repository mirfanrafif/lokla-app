import { useQuery } from '@tanstack/react-query';
import { getProjectDetail } from '../data/services/ProjectService';

export const useGetProjectDetail = (identifier: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async () => getProjectDetail(identifier),
    enabled,
  });

  return query;
};
