import React from 'react';

import { getProjects } from '../../services/project.service';
import UserAddButton from './UserFormPopup/UserAddButton';
import UsersTable from './components/UsersTable/UsersTable';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-8 flex flex-row">
        <h1>Users</h1>
        <UserAddButton projects={projects} />
      </div>
      <UsersTable />
    </div>
  );
};

export default Page;
