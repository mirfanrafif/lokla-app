'use client';

import React from 'react';
import { ProjectItem } from '../../models/ResponseGetTranslationProject';
import { request } from '@apps/translation-app/lib/apiClient';

import toast from 'react-hot-toast';

const ProjectPopup = (props: {
  project: ProjectItem;
  accessToken: string | undefined;
}) => {
  const generateNewApiKey = () => {
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
        console.log(res);
        toast.success('API Key generated');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="w-[350px] max-w-full">
      <h1 className="mb-4">Project Details</h1>
      <p>Project Name: {props.project.name}</p>
      <p>Identifier: {props.project.identifier}</p>
      <p>API Key: {props.project.apiKey ?? '-'}</p>
      {props.project.apiKey === undefined && (
        <button className="button mt-4" onClick={generateNewApiKey}>
          Generate new API Key
        </button>
      )}
    </div>
  );
};

export default ProjectPopup;
