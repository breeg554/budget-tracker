import { json } from '@remix-run/node';

import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  delete: async ({ params }) => {
    assert(params.organizationName);

    return json({});
  },
});
