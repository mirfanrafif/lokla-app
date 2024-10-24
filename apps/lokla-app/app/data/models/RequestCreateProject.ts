import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const RequestCreateProjectSchema = z.object({
  name: z.string().min(3, 'Please give a name'),
  identifier: z.string().min(3, 'Please give a valid identifier'),
  languages: z
    .array(z.string().min(2, 'Please select a valid language'))
    .min(1, 'At least one language is required'),
  defaultLanguage: z.string().min(2, 'Please select a valid language'),
});

export type RequestCreateProject = z.infer<typeof RequestCreateProjectSchema>;

export const createProjectFormResolver = zodResolver(
  RequestCreateProjectSchema
);
