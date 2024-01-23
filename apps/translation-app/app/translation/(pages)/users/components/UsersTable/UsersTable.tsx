import React from 'react';
import { getRole } from 'apps/translation-app/app/translation/services/auth.service';
import { getProjects } from 'apps/translation-app/app/translation/services/project.service';
import { getUsers } from 'apps/translation-app/app/translation/services/translation.service';

import styles from './UsersTable.module.scss';
import UsersTableAction from './UsersTableAction';

const UsersTable = async () => {
  const data = await getUsers();
  const projects = await getProjects();
  const role = await getRole();

  return (
    <table className={styles.usersTable}>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Project Access</th>
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
              {item.projects
                ?.map(
                  (item) =>
                    projects.find((project) => project.identifier == item)?.name
                )
                .join(', ')}
            </td>
            <td>
              <UsersTableAction user={item} projects={projects} role={role} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
