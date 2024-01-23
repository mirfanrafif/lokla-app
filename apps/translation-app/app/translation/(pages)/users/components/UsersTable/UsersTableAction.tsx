'use client';

import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Role } from 'enums/Role.enum';
import React from 'react';
import { ProjectItem } from 'apps/translation-app/app/translation/models/ResponseGetTranslationProject';
import { usePopup } from 'apps/translation-app/hooks/popup.hooks';

import UserFormPopup from '../../UserFormPopup/UserFormPopup';
import { User } from '../../models/User';
import styles from './UsersTable.module.scss';

const UsersTableAction = (props: {
  user: User;
  projects: ProjectItem[];
  role: string | undefined;
}) => {
  const { openPopup } = usePopup();

  return (
    <div className="flex max-w-[200px] flex-row gap-x-4">
      <button
        className={classNames(styles.actionButton, styles.edit)}
        title="Edit"
        onClick={() => {
          openPopup(
            <UserFormPopup project={props.projects} user={props.user} />,
          );
        }}
      >
        <FontAwesomeIcon icon={faPencil} />
      </button>

      <button
        className={classNames(styles.actionButton, styles.delete)}
        title="Delete"
        disabled={props.role === Role.Editor}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default UsersTableAction;
