import React from 'react';

import { getAccessToken } from '../../services/auth.service';
import { getProjects } from '../../services/project.service';
import UsersTable from './components/UsersTable/UsersTable';
import UserAddButton from './UserFormPopup/UserAddButton';

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
