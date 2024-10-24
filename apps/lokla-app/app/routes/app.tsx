import DashboardContainer from '../components/DashboardContainer/DashboardContainer';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { Outlet, useLoaderData } from '@remix-run/react';

const ProjectListPage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <DashboardContainer authData={data}>
      <Outlet />
    </DashboardContainer>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /projects directly
  const data = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json(data);
}

export default ProjectListPage;
