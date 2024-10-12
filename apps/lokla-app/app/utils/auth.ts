// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { sessionStorage } from './sessionStorage';
import { FormStrategy } from 'remix-auth-form';
import { getApiClient } from './apiClient';
import {
  ResponseLogin,
  ResponseLoginSchema,
} from '../data/models/ResponseLogin';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

export const authenticator = new Authenticator<ResponseLogin>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    try {
      const email = form.get('email');
      const password = form.get('password');

      const response = await getApiClient().post('/auth/login', {
        email,
        password,
      });

      console.log(response.data);

      const data = ResponseLoginSchema.parse(response.data);

      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Invalid credentials');
    }
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass'
);
