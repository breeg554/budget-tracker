import { createCookieSessionStorage } from "@remix-run/node";

type AuthData = {};

type SessionData = {
  expirationDate: number;
} & AuthData;

const createSession = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET as string],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 31,
  },
});

export const { getSession, commitSession, destroySession } = createSession;

export const logout = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  const headers = new Headers();
  headers.set("Set-Cookie", await destroySession(session));

  return headers;
};

export const requireSignedIn = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
};

export const requireNotSignedIn = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
};

export const setAuthSession = async (
  sessionData: AuthData,
  request: Request
) => {
  const session = await getSession(request.headers.get("Cookie"));

  return await commitSession(session);
};
