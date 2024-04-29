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
  dashboard: {
    pattern: "/" as const,
    getPath: () => "/" as const,
  },
  statistics: {
    pattern: "/statistics" as const,
    getPath: () => "/statistics" as const,
  },
  profile: {
    pattern: "/profile" as const,
    getPath: () => "/profile" as const,
  },
  receipts: {
    pattern: "/receipts" as const,
    getPath: () => "/receipts" as const,
  },
  newReceipt: {
    pattern: "/receipts/new" as const,
    getPath: () => `${routes.receipts.getPath()}/new` as const,
  },
} as const;
