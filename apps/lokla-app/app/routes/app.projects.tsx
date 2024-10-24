import ProjectCard from '../components/ProjectItem/ProjectItem';
import { Heading } from '@chakra-ui/react';
import AddProjectModal from '../components/AddProjectModal/AddProjectModal';
import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { getProjectList } from '../data/services/ProjectService';
import { ProjectItem } from '../data/models/ResponseGetTranslationProject';
import { useLoaderData } from '@remix-run/react';

type ProjectListPageProps = {
  projects: ProjectItem[];
};

const ProjectListPage = () => {
  const { projects } = useLoaderData<ProjectListPageProps>();

  return (
    <div className="space-y-6">
      <div className="w-full flex flex-row justify-between">
        <Heading size="lg">Projects</Heading>
        <AddProjectModal />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {projects &&
          projects?.map((project) => (
            <ProjectCard key={project.identifier} project={project} />
          ))}
      </div>
    </div>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /projects directly
  const authData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const projects = await getProjectList(authData.accessToken);

  return {
    projects,
  };
}

export default ProjectListPage;
