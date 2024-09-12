import DashboardContainer from '../components/DashboardContainer/DashboardContainer';
import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { Outlet } from '@remix-run/react';

const ProjectListPage = () => {
  return (
    <DashboardContainer>
      <Outlet />
    </DashboardContainer>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /projects directly
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
}

export default ProjectListPage;
