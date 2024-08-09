import { getApiClient } from '../../utils/apiClient';
import { ResponseGetTranslationProjectSchema } from '../models/ResponseGetTranslationProject';

export const getProjectList = async () => {
  const response = await getApiClient().get('/projects');

  const data = ResponseGetTranslationProjectSchema.parse(response.data);

  return data;
};

export const getProjectDetail = async (id: string) => {
  const response = await getApiClient().get(`/projects/${id}`);

  return response.data;
};
