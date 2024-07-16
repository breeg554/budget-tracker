import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { routes } from '~/routes';

type AuthData = {
  tokens: string;
};

const createSession = createCookieSessionStorage<AuthData, Record<string, any>>(
  {
    cookie: {
      name: '__session',
      secrets: [process.env.SESSION_SECRET as string],
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 31,
    },
  },
);

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
