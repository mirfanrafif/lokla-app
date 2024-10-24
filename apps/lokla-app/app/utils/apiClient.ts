import axios from 'axios';

// declare const window: any;

export const getApiClient = (accessToken?: string) => {
  const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  });

  return apiClient;
};
