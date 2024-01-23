export const request = async (
  url: string,
  options: RequestInit,
  accessToken?: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api${url}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (response.status >= 400) {
    throw Error(JSON.stringify(data.message));
  }

  return data;
};
