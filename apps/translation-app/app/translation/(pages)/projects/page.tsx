import CreateProjectButton from '../../components/CreateProjectButton/CreateProjectButton';
import ProjectItemCard from '../../components/ProjectItem/ProjectItem';
import { getAccessToken } from '../../services/auth.service';
import { getProjects } from '../../services/project.service';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const projects = await getProjects();

  console.log(projects);

  return (
    <div>
      <div className="mb-6 flex items-center">
        <h1 className="flex-1">Projects</h1>
        <CreateProjectButton accessToken={getAccessToken()} />
      </div>

      <div className="space-y-4">
        {projects.map((item) => (
          <ProjectItemCard
            key={item.identifier}
            item={item}
            accessToken={getAccessToken()}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
