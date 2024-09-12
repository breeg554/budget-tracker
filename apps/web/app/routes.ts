import { buildUrlWithParams, UrlQueryParams } from '~/utils/url';

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
    getPath: (organizationName: string, params?: UrlQueryParams) =>
      buildUrlWithParams(`/${organizationName}`, params),
  },
  statistics: {
    pattern: '/:organizationName/statistics' as const,
    getPath: (organizationName: string, params?: UrlQueryParams) =>
      buildUrlWithParams(
        `${routes.organization.getPath(organizationName)}/statistics`,
        params,
      ),
  },
  profile: {
    pattern: '/:organizationName/profile' as const,
    getPath: (organizationName: string) =>
      `${routes.organization.getPath(organizationName)}/profile` as const,
  },
  receipts: {
    pattern: '/:organizationName/receipts' as const,
    getPath: (organizationName: string, params?: UrlQueryParams) =>
      buildUrlWithParams(
        `${routes.organization.getPath(organizationName)}/receipts`,
        params,
      ),
  },
  newReceipt: {
    pattern: '/:organizationName/receipts/new' as const,
    getPath: (organizationName: string) =>
      `${routes.receipts.getPath(organizationName)}/new` as const,
  },
  receipt: {
    pattern: '/:organizationName/receipts/:transactionId' as const,
    getPath: (
      organizationName: string,
      transactionId: string,
      params?: UrlQueryParams,
    ) =>
      buildUrlWithParams(
        `${routes.receipts.getPath(organizationName)}/${transactionId}`,
        params,
      ),
  },
  receiptItem: {
    pattern: '/:organizationName/receipts/:transactionId/:itemId' as const,
    getPath: (
      organizationName: string,
      transactionId: string,
      itemId: string,
      params?: UrlQueryParams,
    ) =>
      buildUrlWithParams(
        `${routes.receipt.getPath(organizationName, transactionId)}/${itemId}`,
        params,
      ),
  },
  scanReceipt: {
    pattern: '/:organizationName/receipts/new/scan' as const,
    getPath: (organizationName: string) =>
      `${routes.newReceipt.getPath(organizationName)}/scan` as const,
  },
} as const;
