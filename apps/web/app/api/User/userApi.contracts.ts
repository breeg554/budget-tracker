import { z } from 'zod';

export const userMeSchema = z.object({
  email: z.string().email(),
  id: z.string(),
});
