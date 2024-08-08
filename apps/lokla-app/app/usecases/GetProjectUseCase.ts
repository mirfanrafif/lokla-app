import { useQuery } from '@tanstack/react-query';
import { getProjectList } from '../data/services/ProjectService';

export const useGetProject = () => {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async () => getProjectList(),
  });

  return query;
};
