import * as z from 'zod';

export const RequestUpdateTranslationSchema = z.object({
  oldKey: z.string(),
  newKey: z.string(),
  namespace: z.string(),
  project: z.string(),
  translations: z.array(
    z.object({
      locale: z.string(),
      value: z.string(),
    }),
  ),
});

export type RequestUpdateTranslation = z.infer<
  typeof RequestUpdateTranslationSchema
>;
