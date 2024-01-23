import { languages } from 'constants/languages';
import React from 'react';

import Pagination from '../../components/Pagination/Pagination';
import TranslationFilter from '../../components/TranslationFilter/TranslationFilter';
import { TranslationTable } from '../../components/TranslationTable/TranslationTable';
import UploadButton from '../../components/UploadButton';
import { getAccessToken } from '../../services/auth.service';
import { getProjects } from '../../services/project.service';
import {
  getNamespaces,
  getTranslationData,
} from '../../services/translation.service';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

export type TranslationListSearchParams = {
  search: string | undefined;
  page: string | undefined;
  limit: string | undefined;
  project: string | undefined;
  ns: string | undefined;
  filter: string | undefined;
};

const Page = async ({
  searchParams,
}: {
  searchParams: TranslationListSearchParams;
}) => {
  const [translationData, namespaces, projects] = await Promise.all([
    getTranslationData({
      search: searchParams.search,
      page: searchParams.page ? Number(searchParams.page) : 0,
      limit: searchParams.limit ? Number(searchParams.limit) : 15,
      project: searchParams.project,
      ns: searchParams.ns,
      filter: searchParams.filter,
    }),
    getNamespaces(searchParams.project),
    getProjects(),
  ]);

  return (
    <div>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Editor</h1>

        <UploadButton project={projects} accessToken={getAccessToken()} />
      </div>
      <TranslationFilter namespaces={namespaces} projects={projects} />
      <TranslationTable
        translations={translationData.data}
        languages={languages}
      />

      <Pagination
        totalPage={translationData.meta.total_page}
        currentPage={searchParams.page ? Number(searchParams.page) : 0}
      />
    </div>
  );
};

export default Page;
