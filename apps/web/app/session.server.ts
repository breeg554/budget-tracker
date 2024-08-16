import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { routes } from '~/routes';
import { ToastProps } from '~/toasts/Toast.interface';

type AuthData = {
  tokens: string;
};

type SessionData = {
  organizationName?: string;
} & AuthData;

type Toasts = {
  success: ToastProps | string;
  error: ToastProps | string;
  warning: ToastProps | string;
};

type FlushData = {
  toasts?: Partial<Toasts>;
};

const createSession = createCookieSessionStorage<SessionData, FlushData>({
  cookie: {
    name: '__session',
    secrets: [process.env.SESSION_SECRET as string],
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 31,
  },
});

export const { getSession, commitSession, destroySession } = createSession;

export const logout = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await getSession(cookie);

  return await destroySession(session);
};

export const requireSignedIn = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await getSession(cookie);

  if (!session.get('tokens')) {
    throw redirect(routes.signIn.getPath(), {
      headers: { 'Set-cookie': await logout(request) },
    });
  }
};

export const requireNotSignedIn = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await getSession(cookie);

  if (session.get('tokens')) {
    throw redirect(routes.dashboard.getPath());
  }
};

export const setAuthSession = async (request: Request, response: Response) => {
  const authCookie = response.headers.get('Set-Cookie')!;
  const session = await getSession(request.headers.get('Cookie'));

  session.set('tokens', authCookie);

  return await commitSession(session);
};

export const setLastOrganization = async (
  request: Request,
  organizationName: string,
) => {
  const session = await getSession(request.headers.get('Cookie'));

  session.set('organizationName', organizationName);

  return await commitSession(session);
};

export const getLastOrganization = async (
  request: Request,
): Promise<string | undefined> => {
  const cookie = request.headers.get('Cookie');
  const session = await getSession(cookie);

  return session.get('organizationName');
};

export const setServerToasts = async (
  request: Request,
  toasts: Partial<Toasts>,
) => {
  const session = await getSession(request.headers.get('Cookie'));

  session.flash('toasts', toasts);

  return await commitSession(session);
};

export const getServerToasts = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));

  const toasts = session.get('toasts');

  return { cookie: await commitSession(session), toasts };
};
