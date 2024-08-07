import axios from 'axios';

declare const window: any;

export const apiClient = axios.create({
  baseURL:
    typeof window !== 'undefined'
      ? `${window.ENV.API_BASE_URL}/api`
      : 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});
