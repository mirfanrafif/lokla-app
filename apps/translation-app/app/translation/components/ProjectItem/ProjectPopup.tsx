'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { request } from '@apps/translation-app/lib/apiClient';
import { ProjectItem } from '../../models/ResponseGetTranslationProject';

import styles from './ProjectPopup.module.scss';

const ProjectPopup = (props: {
  project: ProjectItem;
  accessToken: string | undefined;
}) => {
  const router = useRouter();
  const { closePopup } = usePopup();

  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);

  const generateNewApiKey = () => {
    setIsApiKeyLoading(true);
    request(
      '/projects/generateApiKey',
      {
        method: 'POST',
        body: JSON.stringify({
          projectId: props.project.identifier,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      props.accessToken,
    )
      .then((res) => {
        router.refresh();
        closePopup();

        window.navigator.clipboard.writeText(res.apiKey);
        toast.success('API Key generated and copied to clipboard');
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsApiKeyLoading(false);
      });
  };

  return (
    <div className="w-[350px] max-w-full">
      <h1 className="mb-4">Project Details</h1>
      <p>Project Name: {props.project.name}</p>
      <p>Identifier: {props.project.identifier}</p>
      <p
        className={styles.apiKey}
        onClick={() => {
          window.navigator.clipboard.writeText(props.project.apiKey ?? '');
          toast.success('Copied to clipboard');
        }}
      >
        API Key: <code>{props.project.apiKey ?? '-'}</code>
      </p>
      <button
        className="button mt-4"
        onClick={generateNewApiKey}
        disabled={isApiKeyLoading}
      >
        {props.project.apiKey ? 'Regenerate API Key' : 'Generate new API Key'}
      </button>
    </div>
  );
};

export default ProjectPopup;
