'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import TripleDotMenu from '@apps/translation-app/components/TripleDots/TripleDotMenu';
import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { ProjectItem } from '../../models/ResponseGetTranslationProject';
import { buildTranslationListUrl } from '../../navigations/translations.navigation';
import ProjectPopup from './ProjectPopup';

const ProjectItemCard = (props: {
  item: ProjectItem;
  accessToken: string | undefined;
}) => {
  const { openPopup } = usePopup();
  const router = useRouter();

  return (
    <div
      className="flex w-full items-center gap-x-4 rounded-lg bg-white p-4"
      key={props.item.identifier}
    >
      <div className="flex-1 space-y-2">
        <h1>{props.item.name}</h1>
        <p>Identifier: {props.item.identifier}</p>
      </div>

      <TripleDotMenu
        menus={[
          {
            label: 'Go to translations',
            onClick: () => {
              router.push(
                buildTranslationListUrl({
                  project: props.item.identifier,
                  filter: undefined,
                  limit: undefined,
                  ns: undefined,
                  page: undefined,
                  search: undefined,
                }),
              );
            },
          },
          {
            label: 'See Details',
            onClick: () => {
              openPopup(
                <ProjectPopup
                  project={props.item}
                  accessToken={props.accessToken}
                />,
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default ProjectItemCard;
