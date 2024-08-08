import React from 'react';
import { useGetProject } from '../usecases/GetProjectUseCase';
import ProjectCard from '../components/ProjectItem/ProjectItem';
import DashboardContainer from '../components/DashboardContainer/DashboardContainer';
import { Button, Heading } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const ProjectListPage = () => {
  const { data: projects } = useGetProject();

  return (
    <DashboardContainer>
      <div className="space-y-6">
        <div className="w-full flex flex-row justify-between">
          <Heading size="lg">Projects</Heading>
          <Button colorScheme="green" leftIcon={<AddIcon />}>
            Add Project
          </Button>
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
