'use client';

import React from 'react';
import { ProjectItem } from '../../models/ResponseGetTranslationProject';
import { buildTranslationListUrl } from '../../navigations/translations.navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import ProjectPopup from './ProjectPopup';

const ProjectItemCard = (props: {
  item: ProjectItem;
  accessToken: string | undefined;
}) => {
  const { openPopup } = usePopup();

  return (
    <div
      className="flex w-full items-center gap-x-4 rounded-lg bg-white p-4"
      key={props.item.identifier}
      onClick={() => {
        openPopup(
          <ProjectPopup project={props.item} accessToken={props.accessToken} />,
        );
      }}
    >
      <div className="flex-1 space-y-2">
        <h1>{props.item.name}</h1>
        <p>Identifier: {props.item.identifier}</p>
      </div>

      <a
        href={buildTranslationListUrl({
          project: props.item.identifier,
          filter: undefined,
          limit: undefined,
          ns: undefined,
          page: undefined,
          search: undefined,
        })}
        className="mr-6 h-6 w-6"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </div>
  );
};

export default ProjectItemCard;
