import { Heading } from '@chakra-ui/react';
import TranslationsTable from '../components/TranslationTable/TranslationsTable';
import Pagination from '../components/Pagination/Pagination';

import {
  ShouldRevalidateFunction,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import TranslationFilter from '../components/TranslationFilter/TranslationFilter';
import queryString from 'query-string';

import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '../utils/auth';
import { ResponseGetTranslationData } from '../data/models/ResponseGetTranslationData';
import {
  getProjectLocales,
  getProjectNamespaces,
  getTranslations,
  updateTranslation,
} from '../data/services/TranslationService';
import { mapUrlSearchParamsToObj } from '../utils/urlSearchParamsToObj';
import { getValidatedFormData } from 'remix-hook-form';
import {
  TranslationDataRowForm,
  translationFormResolver,
} from '../data/models/TranslationForm';

export type TranslationListSearchParams = {
  search: string | undefined;
  page: string | undefined;
  limit: string | undefined;
  project: string | undefined;
  ns: string | undefined;
  filter: string | undefined;
};

export const buildTranslationListUrl = (
  params: TranslationListSearchParams
) => {
  return `/app/translations?${queryString.stringify(params)}`;
};

type TranslationsPageProps = {
  translations: ResponseGetTranslationData;
  namespaces: string[];
  locales: string[];
};

const TranslationsPage = () => {
  const [params, setParams] = useSearchParams();

  const { translations, namespaces, locales } =
    useLoaderData<TranslationsPageProps>();

  return (
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
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /projects directly
  const authData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const params = mapUrlSearchParamsToObj<TranslationListSearchParams>(
    new URLSearchParams(request.url.split('?')[1])
  );

  if (!params.project) {
    return {
      status: 404,
      error: 'Project not found',
    };
  }

  const translations = await getTranslations(
    {
      filter: params.filter,
      limit: params.limit || '15',
      page: params.page || '0',
      ns: params.ns,
      project: params.project,
      search:
        params.search !== undefined && params.search !== ''
          ? params.search
          : undefined,
    },
    authData.accessToken
  );
  const namespaces = await getProjectNamespaces(
    params.project,
    authData.accessToken
  );
  const locales = await getProjectLocales(params.project, authData.accessToken);

  return {
    translations,
    namespaces,
    locales,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const params = new URLSearchParams(request.url.split('?')[1]);
  const project = params.get('project');

  if (!project) {
    return json({ error: 'Invalid project' }, { status: 400 });
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<TranslationDataRowForm>(
    request,
    translationFormResolver
  );

  if (errors) {
    return json({ errors, defaultValues });
  }

  if (!data) {
    return json({ error: 'Invalid data' }, { status: 400 });
  }

  // Do something with the data
  try {
    await updateTranslation(
      {
        namespace: data.namespace,
        oldKey: data.key,
        newKey: data.key,
        project: project,
        translations: data.translations.map((t) => ({
          locale: t.locale,
          value: t.value,
        })),
      },
      authData.accessToken
    );

    // refresh the page
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export default TranslationsPage;
