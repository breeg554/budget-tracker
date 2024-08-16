import { useParams } from '@remix-run/react';

export const useOrganizationName = () => {
  const params = useParams();

  if (!params.organizationName) {
    throw new Error('Organization name is required');
  }

  return params.organizationName;
};
