import { Heading } from '@chakra-ui/react';
import TranslationsTable from '../components/TranslationTable/TranslationsTable';
import DashboardContainer from '../components/DashboardContainer/DashboardContainer';
import Pagination from '../components/Pagination/Pagination';
import { useGetProjectLocales } from '../usecases/GetProjectLocaleUseCase';
import { useGetTranslationsData } from '../usecases/GetTranslationsDataUseCase';
import { useSearchParams } from '@remix-run/react';
import TranslationFilter from '../components/TranslationFilter/TranslationFilter';
import queryString from 'query-string';
import { useGetNamespace } from '../usecases/GetNamespacesUseCase';

export type TranslationListSearchParams = {
  search: string | undefined;
  page: string | undefined;
  limit: string | undefined;
  project: string | undefined;
  ns: string | undefined;
  filter: 'not_translated' | 'all' | undefined;
};

export const buildTranslationListUrl = (
  params: TranslationListSearchParams
) => {
  return `/translations?${queryString.stringify(params)}`;
};

const TranslationsPage = () => {
  const [params, setParams] = useSearchParams();
  const { data: locales } = useGetProjectLocales();
  const { data: translations } = useGetTranslationsData();
  const { data: namespaces } = useGetNamespace();

  return (
    <DashboardContainer>
      <div className="space-y-6">
        <Heading>Translations</Heading>

        <TranslationFilter namespaces={namespaces} />

        <TranslationsTable locales={locales} translations={translations} />

        <Pagination
          currentPage={params.get('page') ? Number(params.get('page')) : 0}
          totalPage={translations?.meta.total_page ?? 1}
          onPageChange={(newPage) => {
            const currentParams = Object.fromEntries(params);

            setParams({
              ...currentParams,
              page: newPage.toString(),
            });
          }}
        />
      </div>
    </DashboardContainer>
  );
};

export default TranslationsPage;
