import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestUpdateTranslation } from '../data/models/RequestUpdateTranslation';
import { getApiClient } from '../utils/apiClient';
import { useToast } from '@chakra-ui/react';

export const useUpdateTranslation = () => {
  const queryCLient = useQueryClient();

  const toast = useToast();

  const mutation = useMutation({
    mutationKey: ['translation', 'update'],
    mutationFn: async (data: RequestUpdateTranslation) => {
      return getApiClient()
        .put('/translations', data)
        .then(() => {
          toast({
            title: 'Translation updated',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          queryCLient.invalidateQueries({
            queryKey: ['translations'],
          });
        });
    },
  });

  return mutation;
};
