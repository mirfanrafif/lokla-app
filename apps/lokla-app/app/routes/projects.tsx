import { useGetProject } from '../usecases/GetProjectUseCase';
import ProjectCard from '../components/ProjectItem/ProjectItem';
import DashboardContainer from '../components/DashboardContainer/DashboardContainer';
import { Heading } from '@chakra-ui/react';
import AddProjectModal from '../components/AddProjectModal/AddProjectModal';

const ProjectListPage = () => {
  const { data: projects } = useGetProject();

  return (
    <DashboardContainer>
      <div className="space-y-6">
        <div className="w-full flex flex-row justify-between">
          <Heading size="lg">Projects</Heading>
          <AddProjectModal />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard key={project.identifier} project={project} />
          ))}
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ProjectListPage;
