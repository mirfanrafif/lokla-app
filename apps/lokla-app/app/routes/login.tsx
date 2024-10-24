import LoginForm from '../components/LoginForm/LoginForm';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { commitSession, getSession } from '../utils/sessionStorage';
import { CookieKeys } from 'lib/constants/cookieKeys';

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-800">
      <LoginForm />
    </div>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/app/projects',
  });
  const session = await getSession(request.headers.get('cookie'));
  const error = session.get(authenticator.sessionErrorKey);

  return json(
    { error },
    {
      headers: {
        'Set-Cookie': await commitSession(session), // You must commit the session whenever you read a flash
      },
    }
  );
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: ActionFunctionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure

  const user = await authenticator.authenticate('user-pass', request, {
    failureRedirect: '/login',
  });

  const session = await getSession(request.headers.get('cookie'));

  // set the user object in the session
  session.set(authenticator.sessionKey, user);

  const commitSessionResult = await commitSession(session);

  // commit the session

  return redirect('/app/projects', {
    headers: [
      ['Set-Cookie', commitSessionResult],
      ['Set-Cookie', `${CookieKeys.User}=${JSON.stringify(user)}; Path=/`],
    ],
  });
}

export default LoginPage;
