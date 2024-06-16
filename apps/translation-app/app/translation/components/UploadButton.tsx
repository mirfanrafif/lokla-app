'use client';

import React from 'react';

import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePopup } from '@frontend/hooks/popup.hooks';
import { useRouter } from 'next/navigation';

import { ResponseGetTranslationProject } from '../models/ResponseGetTranslationProject';
import { TranslationUploader } from './TranslationUploader';

const UploadButton = (props: {
  project: ResponseGetTranslationProject;
  accessToken: string | undefined;
  languages: string[];
}) => {
  const { openPopup, closePopup } = usePopup();
  const router = useRouter();

  return (
    <button
      className="button"
      type="button"
      onClick={() => {
        openPopup(
          <TranslationUploader
            languages={props.languages}
            projects={props.project}
            closePopup={() => {
              closePopup();
              router.refresh();
            }}
            accessToken={props.accessToken}
          />,
        );
      }}
    >
      <FontAwesomeIcon icon={faUpload} className="mr-2 w-4 h-4" />
      Upload
    </button>
  );
};

export default UploadButton;
