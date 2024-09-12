import LoginForm from '../components/LoginForm/LoginForm';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { commitSession, getSession } from '../utils/sessionStorage';
import { CookieKeys } from 'lib/constants/cookieKeys';

const LoginPage = () => {
  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center bg-gray-800"
      style={{
        backgroundImage: 'url(/bg_login.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LoginForm />
    </div>
  );
};

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

  return redirect('/projects', {
    headers: [
      ['Set-Cookie', commitSessionResult],
      ['Set-Cookie', `${CookieKeys.User}=${JSON.stringify(user)}; Path=/`],
    ],
  });
}

export default LoginPage;
