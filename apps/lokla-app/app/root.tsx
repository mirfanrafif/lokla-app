import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import { ChakraProvider } from '@chakra-ui/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import stylesheet from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const meta: MetaFunction = () => [
  {
    title: 'New Remix App',
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
