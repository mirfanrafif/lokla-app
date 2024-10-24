import ProjectCard from '../components/ProjectItem/ProjectItem';
import { Heading } from '@chakra-ui/react';
import AddProjectModal from '../components/AddProjectModal/AddProjectModal';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { getProjectList } from '../data/services/ProjectService';
import { ProjectItem } from '../data/models/ResponseGetTranslationProject';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getValidatedFormData } from 'remix-hook-form';
import {
  createProjectFormResolver,
  RequestCreateProject,
} from '../data/models/RequestCreateProject';
import { createProject } from '../data/services/TranslationService';

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

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
        {projects &&
          projects?.map((project) => (
            <ProjectCard key={project.identifier} project={project} />
          ))}
      </div>

      <Outlet />
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

export async function action({ request }: ActionFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<RequestCreateProject>(
    request,
    createProjectFormResolver
  );

  if (errors) {
    return json({ errors, defaultValues }, { status: 400 });
  }

  if (!data) {
    return json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    await createProject(data, authData.accessToken);

    return {
      success: true,
    };
  } catch (error) {
    return json({ error: 'Failed to create project' }, { status: 400 });
  }
}

export default ProjectListPage;
