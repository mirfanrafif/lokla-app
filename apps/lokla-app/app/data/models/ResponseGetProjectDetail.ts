import { z } from 'zod';

export const ResponseGetProjectDetailSchema = z.object({
  _id: z.string(),
  identifier: z.string(),
  name: z.string(),
  apiKey: z.string(),
  languages: z.array(z.string()),
  __v: z.number(),
  defaultLanguage: z.string(),
  statistics: z.array(z.object({ _id: z.string(), count: z.number() })),
});

export type ResponseGetProjectDetail = z.infer<
  typeof ResponseGetProjectDetailSchema
>;
