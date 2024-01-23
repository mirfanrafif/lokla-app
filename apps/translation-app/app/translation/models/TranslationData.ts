import * as z from 'zod';

export const TranslationDataSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  project: z.string(),
  translations: z.array(
    z.object({
      locale: z.string(),
      value: z.string(),
    }),
  ),
  translated: z.boolean().optional(),
});

export type TranslationData = z.infer<typeof TranslationDataSchema>;
