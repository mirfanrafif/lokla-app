import * as z from 'zod';

export const ProjectItemSchema = z.object({
  name: z.string(),
  identifier: z.string(),
});

export const ResponseGetTranslationProjectSchema = z.array(ProjectItemSchema);

export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export type ResponseGetTranslationProject = z.infer<
  typeof ResponseGetTranslationProjectSchema
>;
