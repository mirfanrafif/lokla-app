'use client'

import React from 'react';
import styles from './Sidebar.module.scss';
import classNames from 'classnames';
import { Role } from 'enums/Role.enum';
import Link from 'next/link';

export const SidebarItem = (props: {
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