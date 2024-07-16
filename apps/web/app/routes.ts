export const routes = {
  signIn: {
    pattern: '/signIn' as const,
    getPath: () => '/signIn' as const,
  },
  signUp: {
    pattern: '/signUp' as const,
    getPath: () => '/signUp' as const,
  },
  signOut: {
    pattern: '/signOut' as const,
    getPath: () => '/signOut' as const,
  },
  dashboard: {
    pattern: '/' as const,
    getPath: () => `/` as const,
  },
  newOrganization: {
    pattern: '/organizations/new' as const,
    getPath: () => `/organizations/new` as const,
  },
  organization: {
    pattern: '/:organizationName' as const,
    getPath: (organizationName: string) => `/${organizationName}` as const,
  },
  statistics: {
    pattern: '/:organizationName/statistics' as const,
    getPath: (organizationName: string) =>
      `${routes.organization.getPath(organizationName)}/statistics` as const,
  },
  profile: {
    pattern: '/:organizationName/profile' as const,
    getPath: (organizationName: string) =>
      `${routes.organization.getPath(organizationName)}/profile` as const,
  },
  receipts: {
    pattern: '/:organizationName/receipts' as const,
    getPath: (organizationName: string) =>
      `${routes.organization.getPath(organizationName)}/receipts` as const,
  },
  newReceipt: {
    pattern: '/:organizationName/receipts/new' as const,
    getPath: (organizationName: string) =>
      `${routes.receipts.getPath(organizationName)}/new` as const,
  },
  scanReceipt: {
    pattern: '/:organizationName/receipts/new/scan' as const,
    getPath: (organizationName: string) =>
      `${routes.newReceipt.getPath(organizationName)}/scan` as const,
  },
} as const;
