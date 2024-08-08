import { useMutation } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { LoginFormData } from '../types/LoginFormData';

import { useToast } from '@chakra-ui/react';

import Cookies from 'js-cookie';

export const useLogin = () => {
  const toast = useToast();

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginFormData) => {
      const response = await getApiClient().post('/auth/login', data);

      Cookies.set('lokla_auth_data', JSON.stringify(response.data));

      toast({
        title: 'Login Success',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      return response.data;
    },
  });

  return mutation;
};
