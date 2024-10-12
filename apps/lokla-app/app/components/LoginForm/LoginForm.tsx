import {
  Card,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Form, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

type LoaderData = {
  error?: {
    message: string;
  };
};

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const data = useLoaderData<LoaderData>();

  const error = data?.error?.message;

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  return (
    <Form method="post" onSubmit={() => setIsLoading(true)}>
      <Card className="w-full max-w-[400px] space-y-12 bg-white p-8 rounded-2xl">
        <img src="/app_logo.png" alt="App Logo" className="w-1/2 mx-auto" />

        <div className="space-y-6">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Type here" name="email" />
          </FormControl>

          <FormControl isInvalid={!!error}>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Type here" name="password" />
            {error && (
              <FormErrorMessage>
                <span>{error}</span>
              </FormErrorMessage>
            )}
          </FormControl>
        </div>
        <Button className="w-full mt-12" type="submit" isLoading={isLoading}>
          Login
        </Button>
      </Card>
    </Form>
  );
};

export default LoginForm;
