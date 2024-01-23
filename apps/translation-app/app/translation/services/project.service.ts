import { request } from '@frontend/lib/apiClient';

import { ResponseGetTranslationProjectSchema } from '../models/ResponseGetTranslationProject';
import { getAccessToken } from './auth.service';

export const getProjects = async () => {
  const response = await request(
    `/projects`,
    {
      method: 'GET',
      cache: 'no-cache',
    },
    getAccessToken(),
  );

  const data = ResponseGetTranslationProjectSchema.parse(response);

  return data;
};
