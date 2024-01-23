'use client';

import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { usePopup } from 'apps/translation-app/hooks/popup.hooks';

import { ProjectItem } from '../../../models/ResponseGetTranslationProject';
import UserFormPopup from './UserFormPopup';

const UserAddButton = (props: { projects: ProjectItem[] }) => {
  const { openPopup } = usePopup();
  return (
    <button
      className="button ml-auto flex flex-row items-center gap-x-2"
      onClick={() => {
        openPopup(<UserFormPopup project={props.projects} />);
      }}
    >
      <FontAwesomeIcon icon={faAdd} className="h-4 w-4" /> Add User
    </button>
  );
};

export default UserAddButton;
