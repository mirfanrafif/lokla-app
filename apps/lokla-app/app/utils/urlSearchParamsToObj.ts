export const mapUrlSearchParamsToObj = <T>(
  searchParams: URLSearchParams
): T => {
  const params = Object.fromEntries(searchParams);

  return params as T;
};
