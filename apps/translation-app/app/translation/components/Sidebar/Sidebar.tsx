'use client';

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

import { LoginUser } from '@apps/translation-app/app/(auth)/models/ResponseLogin';
import {
  buildTranslationListUrl,
  buildTranslationProjectUrl,
  buildTranslationUsersUrl,
} from '../../navigations/translations.navigation';

import styles from './Sidebar.module.scss';

const Sidebar = (props: { user: LoginUser | undefined }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.displayName}>
        <h2>{props.user?.fullName}</h2>
        <h3>{props.user?.role}</h3>
      </div>

      <ul className={styles.sidebarGroup}>
        <SidebarItem
          title="Editor"
          role={[Role.Editor, Role.Developer, Role.Admin]}
          href={buildTranslationListUrl()}
          icon={<FontAwesomeIcon icon={faPencil} className="mr-4 h-6 w-6" />}
          currentRole={props.user?.role as Role | undefined}
        />

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
          onClick={() => {
            window.location.href = '/auth/logout';
          }}
        />
      </ul>
    </div>
  );
};

const SidebarItem = (props: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  role?: Role[];
  className?: string;
  currentRole?: Role | undefined;
}) => {
  if (props.currentRole === undefined) {
    return null;
  }

  if (
    props.role !== undefined &&
    !props.role.includes(props.currentRole as Role)
  ) {
    return null;
  }

  return (
    <li className={classNames(styles.sidebarItem, props.className)}>
      {props.href ? (
        <Link href={props.href}>
          <div className="flex flex-row gap-x-2">
            {props.icon}
            <div className="flex flex-row gap-x-2">{props.title}</div>
          </div>
        </Link>
      ) : (
        <button className="flex flex-row gap-x-2" onClick={props.onClick}>
          {props.icon}
          <div className="flex flex-row gap-x-2">{props.title}</div>
        </button>
      )}
    </li>
  );
};

export default Sidebar;
