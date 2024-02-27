'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { request } from '@apps/translation-app/lib/apiClient';
import { ProjectItem } from '../../models/ResponseGetTranslationProject';
import { ResponseGetTranslationsStatistics } from '../../models/ResponseGetTranslationStatistics';
import { buildTranslationListUrl } from '../../navigations/translations.navigation';

import styles from './ProjectPopup.module.scss';

const ProjectPopup = (props: {
  project: ProjectItem;
  accessToken: string | undefined;
}) => {
  const router = useRouter();
  const { closePopup } = usePopup();

  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);
  const [statistics, setStatistics] =
    useState<ResponseGetTranslationsStatistics>([]);

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

  useEffect(() => {
    request(
      `/translations/statistics?project=${props.project.identifier}`,
      {
        method: 'GET',
      },
      props.accessToken,
    ).then((res) => {
      const data = ResponseGetTranslationsStatistics.parse(res);
      setStatistics(data);
    });
  }, [props.project.identifier, props.accessToken]);

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

      <h1 className="my-4">Statistics</h1>
      <div className="flex flex-col gap-y-4">
        {statistics
          .sort((a, b) => (a.namespace > b.namespace ? 1 : -1))
          .map((stat) => (
            <div
              key={stat.namespace}
              className="flex justify-between px-2 rounded-md cursor-pointer"
              style={{
                background:
                  'linear-gradient(90deg, #FFC107 ' +
                  stat.percentage +
                  '%, #E0E0E0 ' +
                  stat.percentage +
                  '%)',
              }}
              onClick={() => {
                router.push(
                  buildTranslationListUrl({
                    project: props.project.identifier,
                    ns: stat.namespace,
                    search: undefined,
                    filter: 'not_translated',
                    limit: undefined,
                    page: undefined,
                  }),
                );
                closePopup();
              }}
            >
              <p>{stat.namespace}</p>
              <p>
                {stat.translated}/{stat.total} ({Math.round(stat.percentage)}%)
              </p>
            </div>
          ))}
      </div>
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
