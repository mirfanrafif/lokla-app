import { Locales } from '@constants/locales';

export const getLocaleLabel = (code: string) => {
  return `${code} (${Locales.find((item) => item.code === code)?.name ?? 'Custom Language'})`;
};
