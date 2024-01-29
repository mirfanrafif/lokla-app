import * as z from 'zod';

export const ProjectItemSchema = z.object({
  name: z.string(),
  identifier: z.string(),
  apiKey: z.string().optional(),
});

export const ResponseGetTranslationProjectSchema = z.array(ProjectItemSchema);

export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export type ResponseGetTranslationProject = z.infer<
  typeof ResponseGetTranslationProjectSchema
>;
