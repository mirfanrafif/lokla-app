import * as z from 'zod';

export const UserSchema = z.object({
  email: z.string(),
  fullName: z.string(),
  role: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const ResponseGetUserListSchema = z.array(UserSchema);

export type ResponseGetUserList = z.infer<typeof ResponseGetUserListSchema>;
