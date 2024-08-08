import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestCreateProject } from '../data/models/RequestCreateProject';
import { getApiClient } from '../utils/apiClient';

export const useCreateProject = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['project', 'create'],
    mutationFn: async (data: RequestCreateProject) => {
      return getApiClient()
        .post('/projects', data)
        .then((res) => {
          queryClient.invalidateQueries({
            queryKey: ['projects'],
          });
          onSuccess?.();
        });
    },
  });

  return mutation;
};
