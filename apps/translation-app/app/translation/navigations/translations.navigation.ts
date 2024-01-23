import queryString from 'query-string';

import { TranslationListSearchParams } from '../(pages)/editor/page';

export const buildTranslationListUrl = (
  searchParams?: TranslationListSearchParams,
) => {
  return `/translation/editor?${
    searchParams ? queryString.stringify(searchParams) : ''
  }`;
};

export const buildTranslationProjectUrl = () => {
  return `/translation/projects`;
};

export const buildTranslationUsersUrl = () => {
  return '/translation/users';
};
