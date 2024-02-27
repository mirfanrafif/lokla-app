'use client';

import React, { useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { TranslationListSearchParams } from '../../(pages)/editor/page';
import { ResponseGetTranslationProject } from '../../models/ResponseGetTranslationProject';
import { buildTranslationListUrl } from '../../navigations/translations.navigation';

import styles from './TranslationFilter.module.scss';

const TranslationFilter = (props: {
  namespaces: string[];
  projects: ResponseGetTranslationProject;
}) => {
  const timoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries<string | undefined>(
    searchParams.entries(),
  ) as TranslationListSearchParams;

  return (
    <div className={styles.row}>
      <input
        placeholder="Search..."
        className={styles.search}
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(event) => {
          clearTimeout(timoutRef.current);

          timoutRef.current = setTimeout(() => {
            router.push(
              buildTranslationListUrl({
                ...params,
                search: event.target.value,
                page: undefined,
              }),
            );
          }, 300);
        }}
      />

      <select
        name="project"
        defaultValue={searchParams.get('project') ?? ''}
        onChange={(event) => {
          router.push(
            buildTranslationListUrl({
              ...params,
              project: event.target.value,
              ns: undefined,
              filter: undefined,
              page: undefined,
            }),
          );
        }}
      >
        <option value={''}>All Projects</option>
        {props.projects.map((item) => (
          <option key={item.identifier} value={item.identifier}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        name="namespace"
        defaultValue={searchParams.get('ns') ?? ''}
        onChange={(event) => {
          router.push(
            buildTranslationListUrl({
              ...params,
              ns: event.target.value,
              page: undefined,
            }),
          );
        }}
      >
        <option value={''}>All Namespaces</option>
        {props.namespaces.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('filter') ?? ''}
        onChange={(event) => {
          router.push(
            buildTranslationListUrl({
              ...params,
              filter: event.target.value,
              page: undefined,
            }),
          );
        }}
      >
        <option value="">No Filter</option>
        <option value="not_translated">Not Translated</option>
        <option value="unused">Unused</option>
        <option value="duplicated">Duplicated</option>
      </select>
    </div>
  );
};

export default TranslationFilter;
