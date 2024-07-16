import { useParams } from '@remix-run/react';

import { assert } from '~/utils/assert';

export const useOrganizationName = () => {
  const params = useParams();
  assert(params.organizationName);

  return params.organizationName;
};
