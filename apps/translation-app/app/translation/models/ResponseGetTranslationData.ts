import * as z from 'zod';

import { TranslationDataSchema } from './TranslationData';

export const ResponseGetTranslationDataSchema = z.object({
  data: z.array(TranslationDataSchema),
  meta: z.object({
    total_data: z.number(),
    total_page: z.number(),
  }),
});

export type ResponseGetTranslationData = z.infer<
  typeof ResponseGetTranslationDataSchema
>;
