import * as z from 'zod';

export const LoginUserSchema = z.object({
  email: z.string(),
  role: z.string(),
  fullName: z.string().optional(),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;

export const ResponseLoginSchema = z.object({
  accessToken: z.string(),
  user: LoginUserSchema,
});

export type ResponseLogin = z.infer<typeof ResponseLoginSchema>;
