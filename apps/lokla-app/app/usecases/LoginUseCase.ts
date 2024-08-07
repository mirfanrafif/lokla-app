import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { LoginFormData } from '../types/LoginFormData';

export const useLogin = () => {
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post('/auth/login', data);

      return response.data;
    },
  });

  return mutation;
};
