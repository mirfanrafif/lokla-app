import { useMutation } from '@tanstack/react-query';
import { getApiClient } from '../utils/apiClient';
import { LoginFormData } from '../types/LoginFormData';

import { useToast } from '@chakra-ui/react';

import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { useNavigate } from '@remix-run/react';
import { CookieKeys } from 'lib/constants/cookieKeys';

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginFormData) => {
      const response = await getApiClient().post('/auth/login', data);

      Cookies.set(CookieKeys.User, JSON.stringify(response.data));

      navigate('/projects');

      toast({
        title: 'Login Success',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: 'Login Failed',
          description: error.response?.data.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
  });

  return mutation;
};
