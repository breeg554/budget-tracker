import { json, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { PageProgress } from '~/progressBar/PageProgress';

import './style.css';

import { useEffect } from 'react';

import { SessionState } from '~/session.server';
import { errorToast } from '~/toasts/errorToast';
import { successToast } from '~/toasts/successToast';
import { ToastProps } from '~/toasts/Toast.interface';
import { Toaster } from '~/toasts/Toaster';
import { warningToast } from '~/toasts/warningToast';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-foreground">
        <PageProgress />
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export const loader = async (args: LoaderFunctionArgs) => {
  const sessionState = await SessionState.fromRequest(args.request);

  const toasts = sessionState.toasts;

  return json(
    { toasts },
    { headers: { 'Set-Cookie': await sessionState.commit() } },
  );
};

export default function App() {
  const { toasts } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!toasts) return;

    if (toasts.success) {
      successToast(toasts.success as ToastProps);
    }
    if (toasts.error) {
      errorToast(toasts.error as ToastProps);
    }
    if (toasts.warning) {
      warningToast(toasts.warning as ToastProps);
    }
  }, [JSON.stringify(toasts)]);

  return <Outlet />;
}
