import { getApiClient } from '../../utils/apiClient';
import { ResponseGetProjectDetailSchema } from '../models/ResponseGetProjectDetail';
import { ResponseGetTranslationProjectSchema } from '../models/ResponseGetTranslationProject';

export const getProjectList = async (accessToken?: string) => {
  const response = await getApiClient(accessToken).get('/projects');

  const data = ResponseGetTranslationProjectSchema.parse(response.data);

  return data;
};

export const getProjectDetail = async (id: string) => {
  const response = await getApiClient().get(`/projects/${id}`);

  const data = ResponseGetProjectDetailSchema.parse(response.data);

  return data;
};
