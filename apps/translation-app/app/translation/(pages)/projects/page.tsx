import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CreateProjectButton from '../../components/CreateProjectButton/CreateProjectButton';
import { buildTranslationListUrl } from '../../navigations/translations.navigation';
import { getProjects } from '../../services/project.service';
import { getAccessToken } from '../../services/auth.service';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-6 flex items-center">
        <h1 className="flex-1">Projects</h1>
        <CreateProjectButton accessToken={getAccessToken()} />
      </div>

      <div className="space-y-4">
        {projects.map((item) => (
          <div
            className="flex w-full items-center gap-x-4 rounded-lg bg-white p-4 dark:bg-neutral-700"
            key={item.identifier}
          >
            <div className="flex-1 space-y-2">
              <h1>{item.name}</h1>
              <p className="dark:text-white">Identifier: {item.identifier}</p>
            </div>

            <a
              href={buildTranslationListUrl({
                project: item.identifier,
                filter: undefined,
                limit: undefined,
                ns: undefined,
                page: undefined,
                search: undefined,
              })}
              className="mr-6 h-6 w-6"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
