import { TranslationListSearchParams } from '../../routes/app.translations';
import { getApiClient } from '../../utils/apiClient';
import { RequestUpdateTranslation } from '../models/RequestUpdateTranslation';
import { ResponseGetLocalesSchema } from '../models/ResponseGetLocales';
import { ResponseGetTranslationNamespacesSchema } from '../models/ResponseGetNamespaces';
import { ResponseGetTranslationDataSchema } from '../models/ResponseGetTranslationData';

export const getTranslations = async (
  params: TranslationListSearchParams,
  accessToken?: string
) => {
  const response = await getApiClient(accessToken).get('/translations', {
    params,
  });

  const data = ResponseGetTranslationDataSchema.parse(response.data);

  return data;
};

export const getProjectNamespaces = async (
  projectId: string,
  accessTokken?: string
) => {
  const response = await getApiClient(accessTokken).get(
    '/translations/namespaces',
    {
      params: {
        project: projectId,
      },
    }
  );

  const data = ResponseGetTranslationNamespacesSchema.parse(response.data);

  return data;
};

export const getProjectLocales = async (
  projectId: string,
  accessToken?: string
) => {
  const response = await getApiClient(accessToken).get(
    '/translations/locales',
    {
      params: {
        projectId,
      },
    }
  );

  const data = ResponseGetLocalesSchema.parse(response.data);

  return data;
};

export const updateTranslation = async (
  data: RequestUpdateTranslation,
  accessToken?: string
) => {
  await getApiClient(accessToken).put('/translations', data);
};
