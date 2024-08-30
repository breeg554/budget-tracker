import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
