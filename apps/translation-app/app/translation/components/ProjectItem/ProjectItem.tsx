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

  const maxItems = Math.max(
    ...(props.item.statistics?.map((item) => item.count) ?? []),
  );

  return (
    <div
      className="flex w-full items-center gap-x-4 rounded-lg bg-white hover:bg-neutral-50"
      key={props.item.identifier}
    >
      <div
        className="flex-1 space-y-2 cursor-pointer p-4"
        onClick={() => {
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
        }}
      >
        <h1>{props.item.name}</h1>
        <p>Identifier: {props.item.identifier}</p>
      </div>

      <div className="w-[400px]">
        {props.item.statistics?.map((item) => (
          <div key={item.locale} className="flex items-center gap-x-4 p-4 ">
            <div className="w-4">{item.locale}</div>
            <div
              className="flex-1 h-4 rounded-full"
              style={{
                background: `linear-gradient(to right, var(--primary-default) ${Math.floor((item.count / maxItems) * 100)}%, var(--primary-light-bg) ${Math.floor((item.count / maxItems) * 100)}%)`,
              }}
            ></div>
          </div>
        ))}
      </div>

      <TripleDotMenu
        className="mr-4"
        menus={[
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
