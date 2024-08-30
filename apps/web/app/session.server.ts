import { createCookieSessionStorage, redirect, Session } from '@remix-run/node';

import { UserMeDto } from '~/api/User/userApi.types';
import { routes } from '~/routes';
import { ToastProps } from '~/toasts/Toast.interface';

type AuthData = {
  tokens: string;
};

type SessionData = {
  organizationName?: string;
  currentUser?: UserMeDto;
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

export class SessionState {
  constructor(private readonly session: Session<SessionData, FlushData>) {}

  static async fromRequest(request: Request) {
    const cookie = request.headers.get('Cookie');

    return new SessionState(await getSession(cookie));
  }

  setAuthCookie(cookie: string) {
    this.session.set('tokens', cookie);

    return this;
  }

  setCurrentUser(user: UserMeDto) {
    this.session.set('currentUser', user);

    return this;
  }

  setOrganizationName(organizationName: string) {
    this.session.set('organizationName', organizationName);

    return this;
  }

  setToasts(toasts: Partial<Toasts>) {
    this.session.flash('toasts', toasts);

    return this;
  }

  async commit() {
    return await commitSession(this.session);
  }

  async logout() {
    return await destroySession(this.session);
  }

  get tokens() {
    return this.session.get('tokens');
  }

  get organizationName() {
    return this.session.get('organizationName');
  }

  get toasts() {
    return this.session.get('toasts');
  }

  get currentUser() {
    return this.session.get('currentUser');
  }
}

export const requireSignedIn = async (request: Request) => {
  const sessionState = await SessionState.fromRequest(request);

  if (!sessionState.tokens) {
    throw redirect(routes.signIn.getPath(), {
      headers: { 'Set-cookie': await sessionState.logout() },
    });
  }
};

export const requireNotSignedIn = async (request: Request) => {
  const sessionState = await SessionState.fromRequest(request);

  if (sessionState.tokens) {
    throw redirect(routes.dashboard.getPath());
  }
};
