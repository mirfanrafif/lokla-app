'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { request } from 'apps/translation-app/lib/apiClient';

import { ResponseGetTranslationProject } from '../models/ResponseGetTranslationProject';
import styles from './TranslationUploader.module.scss';

type TranslationUploadForm = {
  file: FileList;
  namespace: string;
  selectedLanguage: string;
  project: string;
};

export const TranslationUploader = (props: {
  languages: string[];
  projects: ResponseGetTranslationProject;
  closePopup: () => void;
  accessToken: string | undefined;
}) => {
  const params = useSearchParams();
  const form = useForm<TranslationUploadForm>({
    defaultValues: {
      project: params.get('project') ?? undefined,
    },
  });

  const uploadFile = form.handleSubmit(
    async (data) => {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('namespace', data.namespace);
      formData.append('locale', data.selectedLanguage);
      formData.append('project', data.project);

      return request(
        `/translations/import`,
        {
          method: 'POST',
          body: formData,
        },
        props.accessToken,
      )
        .then(() => {
          toast.success('Success importing translations');
          props.closePopup();
        })
        .catch((error) => {
          toast.error(`Error importing translations: ${error.message}`);
        });
    },
    (error) => {
      toast.error(`Error uploading form`);
    },
  );

  return (
    <form action="" onSubmit={uploadFile}>
      <div className={styles.uploadForm}>
        <h1 className="text-black">Upload Translation</h1>

        <label htmlFor="File">Upload File</label>
        <input
          type={'file'}
          accept={'application/json'}
          {...form.register('file', {
            required: true,
            onChange: (event) => {
              const uploadedFile = event.target.files[0];

              if (uploadedFile) {
                form.setValue('namespace', uploadedFile.name.split('.')[0]);
              }
            },
          })}
        />
        <label htmlFor={'project'}>Project</label>

        <select
          {...form.register('project', {
            required: true,
          })}
          placeholder="Select Project"
        >
          {props.projects.map((item) => (
            <option key={item.identifier} value={item.identifier}>
              {item.name}
            </option>
          ))}
        </select>
        <label htmlFor={'namespace'}>Namespace</label>
        <input
          placeholder={'Should be autofilled'}
          disabled
          {...form.register('namespace', {
            required: true,
          })}
        />

        <label htmlFor={'Language'}>Language</label>

        <select
          {...form.register('selectedLanguage', {
            required: true,
          })}
        >
          {props.languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          onClick={uploadFile}
          className="button"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Upload
        </button>
      </div>
    </form>
  );
};
