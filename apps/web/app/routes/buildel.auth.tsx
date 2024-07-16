import { json } from '@remix-run/node';
import { BuildelAuth } from '@buildel/buildel-auth';
import { z } from 'zod';

import { requireSignedIn } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

const schema = z.object({ socket_id: z.string(), channel_name: z.string() });

export const action = actionHandler({
  post: async ({ request }) => {
    await requireSignedIn(request);

    const body = JSON.parse(await request.text());

    const result = schema.safeParse(body);

    if (!result.success) {
      return json({});
    }

    // @ts-ignore
    const buildelAuth = new BuildelAuth(process.env.BUILDEL_SECRET);

    const authData = buildelAuth.generateAuth(
      result.data.socket_id,
      result.data.channel_name,
    );

    return json(authData);
  },
});
