'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { usePopup } from 'apps/translation-app/hooks/popup.hooks';
import { request } from 'apps/translation-app/lib/apiClient';

import { RequestCreateProject } from '../../models/RequestCreateProject';
import CreateProjectPopup from './CreateProjectPopup';
import { useRouter } from 'next/navigation';

const CreateProjectButton = (props: { accessToken: string | undefined }) => {
  const { openPopup, closePopup } = usePopup();
  const router = useRouter();

  const createNewProjectAction = (data: RequestCreateProject) => {
    request(
      '/projects',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      props.accessToken,
    )
      .then(() => {
        closePopup();
        router.refresh();
        toast.success(`Project ${data.name} created`);
      })
      .catch((error) => {
        toast.error(`Error creating project: ${error.message}`);
      });
  };

  const openNewProjectPopup = () => {
    openPopup(<CreateProjectPopup onSubmit={createNewProjectAction} />);
  };

  return (
    <button className="button" onClick={openNewProjectPopup}>
      Create New Project
    </button>
  );
};

export default CreateProjectButton;
