import React from 'react';

import { getProjects } from '../../services/project.service';
import UserAddButton from './UserFormPopup/UserAddButton';
import UsersTable from './components/UsersTable/UsersTable';
import { getAccessToken } from '../../services/auth.service';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const projects = await getProjects();
  const accessToken = getAccessToken();

  return (
    <div>
      <div className="mb-8 flex flex-row">
        <h1>Users</h1>
        <UserAddButton projects={projects} accessToken={accessToken} />
      </div>
      <UsersTable />
    </div>
  );
};

export default Page;
