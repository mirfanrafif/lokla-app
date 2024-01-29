import React from 'react';

import {
  getAccessToken,
  getRole,
} from '@frontend/app/translation/services/auth.service';
import { getProjects } from '@frontend/app/translation/services/project.service';
import { getUsers } from '@frontend/app/translation/services/translation.service';

import UsersTableAction from './UsersTableAction';

import styles from './UsersTable.module.scss';

const UsersTable = async () => {
  const data = await getUsers();
  const projects = await getProjects();
  const role = await getRole();
  const accessToken = getAccessToken();

  return (
    <table className={styles.usersTable}>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.email}>
            <td>{item.fullName}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>
              <UsersTableAction
                user={item}
                projects={projects}
                role={role}
                accessToken={accessToken}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
