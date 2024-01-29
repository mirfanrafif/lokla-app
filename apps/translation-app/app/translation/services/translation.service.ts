'use server';

import queryString from 'query-string';
import { request } from '@frontend/lib/apiClient';

import { ResponseGetTranslationNamespacesSchema } from '../models/ResponseGetNamespaces';
import {
  ResponseGetTranslationData,
  ResponseGetTranslationDataSchema,
} from '../models/ResponseGetTranslationData';

import { ResponseGetUserListSchema } from '../(pages)/users/models/User';
import { getAccessToken } from './auth.service';

export const getTranslationData = async (params: {
  search: string | undefined;
  page: number;
  limit: number;
  project: string | undefined;
  ns: string | undefined;
  filter: string | undefined;
}): Promise<ResponseGetTranslationData> => {
  const validate = (i: string | undefined) => {
    return i !== null && i !== '' ? i : undefined;
  };
  const requestData = {
    ...params,
    project: validate(params.project),
    ns: validate(params.ns),
    filter: validate(params.filter),
  };

  const response = await request(
    `/translations?${queryString.stringify(requestData)}`,
    {
      method: 'GET',
      cache: 'no-cache',
    },
    getAccessToken(),
  );

  const data = ResponseGetTranslationDataSchema.parse(response);

  return data;
};

export const getNamespaces = async (
  project: string | undefined,
): Promise<string[]> => {
  const response = await request(
    `/translations/namespaces?${project ? 'project=' + project : ''}`,
    {
      method: 'GET',
      cache: 'no-cache',
    },
    getAccessToken(),
  );

  const data = ResponseGetTranslationNamespacesSchema.parse(response);

  return data;
};

export const getUsers = async () => {
  const response = await request(
    '/users',
    {
      method: 'GET',
      cache: 'no-cache',
    },
    getAccessToken(),
  );

  const data = ResponseGetUserListSchema.parse(response);

  return data;
};
