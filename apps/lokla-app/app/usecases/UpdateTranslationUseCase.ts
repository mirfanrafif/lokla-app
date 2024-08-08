import { useMutation } from '@tanstack/react-query';
import { RequestUpdateTranslation } from '../data/models/RequestUpdateTranslation';
import { getApiClient } from '../utils/apiClient';

export const useUpdateTranslation = () => {
  const mutation = useMutation({
    mutationKey: ['translation', 'update'],
    mutationFn: async (data: RequestUpdateTranslation) => {
      const response = await getApiClient().put('/translations', data);
    },
  });

  return mutation;
};
