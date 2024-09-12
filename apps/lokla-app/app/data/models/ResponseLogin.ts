import { z } from 'zod';
import { UserSchema } from './User';

export const ResponseLoginSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

export type ResponseLogin = z.infer<typeof ResponseLoginSchema>;
