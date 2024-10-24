export const mapUrlSearchParamsToObj = <T>(
  searchParams: URLSearchParams
): T => {
  const params = Object.fromEntries(searchParams);

  // filter empty string
  Object.keys(params).forEach((key) => {
    if (params[key] === '') {
      delete params[key];
    }
  });

  return params as T;
};
