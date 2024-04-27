export const routes = {
  signIn: {
    pattern: "/signIn" as const,
    getPath: () => "/signIn" as const,
  },
  signUp: {
    pattern: "/signUp" as const,
    getPath: () => "/signUp" as const,
  },
  signOut: {
    pattern: "/signOut" as const,
    getPath: () => "/signOut" as const,
  },
  homepage: {
    pattern: "/" as const,
    getPath: () => "/" as const,
  },
} as const;
