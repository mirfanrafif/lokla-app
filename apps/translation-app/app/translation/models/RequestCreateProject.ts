import { z } from 'zod';

export const RequestCreateProjectSchema = z.object({
  name: z.string(),
  identifier: z.string(),
});

export type RequestCreateProject = z.infer<typeof RequestCreateProjectSchema>;
