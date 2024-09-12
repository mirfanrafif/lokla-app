import { Card, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { Form } from '@remix-run/react';

const LoginForm = () => {
  return (
    <Form method="post">
      <Card className="w-full max-w-[400px] space-y-12 bg-white p-8 rounded-2xl">
        <img src="/app_logo.png" alt="App Logo" className="w-1/2 mx-auto" />

        <div className="space-y-6">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Type here" name="email" />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Type here" name="password" />
          </FormControl>
        </div>
        <Button colorScheme="green" className="w-full mt-12" type="submit">
          Login
        </Button>
      </Card>
    </Form>
  );
};

export default LoginForm;
