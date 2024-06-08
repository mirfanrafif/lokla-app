'use client';

import React from 'react';

import { faBook, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Role } from 'enums/Role.enum';
import { useRouter } from 'next/navigation';

import { LoginUser } from '@apps/translation-app/app/(auth)/models/ResponseLogin';
import {
  buildTranslationProjectUrl,
  buildTranslationUsersUrl,
} from '../../navigations/translations.navigation';
import { SidebarItem } from './SidebarItem';

import styles from './Sidebar.module.scss';

const Sidebar = (props: { user: LoginUser | undefined }) => {
  const router = useRouter();

  const logout = () => {
    fetch('/auth/logout', {
      method: 'GET',
    }).then(() => {
      router.push('/login');
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.displayName}>
        <h2>{props.user?.fullName}</h2>
        <h3>{props.user?.role}</h3>
      </div>

      <ul className={styles.sidebarGroup}>
        <SidebarItem
          title="Project"
          role={[Role.Developer, Role.Admin]}
          href={buildTranslationProjectUrl()}
          icon={<FontAwesomeIcon icon={faBook} className="mr-4 h-6 w-6" />}
          currentRole={props.user?.role as Role | undefined}
        />

        <SidebarItem
          title="Users"
          role={[Role.Admin]}
          href={buildTranslationUsersUrl()}
          icon={<FontAwesomeIcon icon={faUser} className="mr-4 h-6 w-6" />}
          currentRole={props.user?.role as Role | undefined}
        />

        <SidebarItem
          title="Logout"
          icon={<FontAwesomeIcon icon={faSignOut} className="mr-4 h-6 w-6" />}
          className={styles.logoutButton}
          currentRole={props.user?.role as Role | undefined}
          onClick={logout}
        />
      </ul>
    </div>
  );
};

export default Sidebar;
