import React from 'react';

import { Card, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import { LoginFormData } from '../../types/LoginFormData';
import { useLogin } from '../../usecases/LoginUseCase';

const LoginForm = () => {
  const form = useForm<LoginFormData>();
  const login = useLogin();

  const submit = form.handleSubmit((data) => {
    login.mutate(data);
  });

  return (
    <Card className="w-full max-w-[400px] space-y-6 bg-white p-4">
      <img src="/app_logo.png" alt="App Logo" className="w-1/2 mx-auto" />

      <FormControl isInvalid={!!form.formState.errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Type here"
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
        />
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.password}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Type here"
          {...form.register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        className="w-full"
        onClick={submit}
        isDisabled={login.isPending}
      >
        Login
      </Button>
    </Card>
  );
};

export default LoginForm;
