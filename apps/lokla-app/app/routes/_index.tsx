// loader to check session

import { LoaderFunctionArgs, redirect } from '@remix-run/node';

export const loader = async (loaderData: LoaderFunctionArgs) => {
  return redirect('/login', {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Lokla!</h1>
      <p>Click on the links above to see the different pages.</p>
    </div>
  );
}
