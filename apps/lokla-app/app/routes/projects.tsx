import React from 'react';
import { useGetProject } from '../usecases/GetProjectUseCase';
import ProjectCard from '../components/ProjectItem/ProjectItem';
import DashboardContainer from '../components/DashboardContainer/DashboardContainer';

const ProjectListPage = () => {
  const { data: projects } = useGetProject();

  return (
    <DashboardContainer>
      <div className="space-y-4">
        {projects?.map((project) => (
          <ProjectCard key={project.identifier} project={project} />
        ))}
      </div>
    </DashboardContainer>
  );
};

export default ProjectListPage;
