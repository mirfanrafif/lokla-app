import React from 'react';

import {
  faBook,
  faPencil,
  faSignOut,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Role } from 'enums/Role.enum';
import Link from 'next/link';

import {
  buildTranslationListUrl,
  buildTranslationProjectUrl,
  buildTranslationUsersUrl,
} from '../../navigations/translations.navigation';
import { getCurrentUser, getRole } from '../../services/auth.service';

import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const user = getCurrentUser();

  return (
    <div className={styles.sidebar}>
      <div className={styles.displayName}>
        <h2>{user?.fullName}</h2>
        <h3>{user?.role}</h3>
      </div>

      <ul className={styles.sidebarGroup}>
        <SidebarItem
          title="Editor"
          role={[Role.Editor, Role.Developer, Role.Admin]}
          href={buildTranslationListUrl()}
          icon={<FontAwesomeIcon icon={faPencil} className="mr-4 h-6 w-6" />}
        />

        <SidebarItem
          title="Project"
          role={[Role.Developer, Role.Admin]}
          href={buildTranslationProjectUrl()}
          icon={<FontAwesomeIcon icon={faBook} className="mr-4 h-6 w-6" />}
        />

        <SidebarItem
          title="Users"
          role={[Role.Admin]}
          href={buildTranslationUsersUrl()}
          icon={<FontAwesomeIcon icon={faUser} className="mr-4 h-6 w-6" />}
        />

        <SidebarItem
          title="Logout"
          href={'/auth/logout'}
          icon={<FontAwesomeIcon icon={faSignOut} className="mr-4 h-6 w-6" />}
          className={styles.logoutButton}
        />
      </ul>
    </div>
  );
};

const SidebarItem = (props: {
  title: string;
  icon: React.ReactNode;
  href: string;
  role?: Role[];
  className?: string;
}) => {
  const role = getRole();

  if (role === undefined) {
    return null;
  }

  if (props.role !== undefined && !props.role.includes(role as Role)) {
    return null;
  }

  return (
    <li className={classNames(styles.sidebarItem, props.className)}>
      <Link href={props.href}>
        <div className="flex flex-row gap-x-2">
          {props.icon}
          <div className="flex flex-row gap-x-2">{props.title}</div>
        </div>
      </Link>
    </li>
  );
};

export default Sidebar;
