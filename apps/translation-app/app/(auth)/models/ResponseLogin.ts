import * as z from 'zod';

export const LoginUserSchema = z.object({
  email: z.string(),
  role: z.string(),
});

export const ResponseLoginSchema = z.object({
  accessToken: z.string(),
  user: LoginUserSchema,
});

export type ResponseLogin = z.infer<typeof ResponseLoginSchema>;
