import * as z from 'zod';

export const ResponseGetTranslationNamespacesSchema = z.array(z.string());

export type ResponseGetTranslationNamespaces = z.infer<
  typeof ResponseGetTranslationNamespacesSchema
>;
