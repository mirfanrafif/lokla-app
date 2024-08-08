import { z } from 'zod';

export const ResponseGetTranslationsStatistics = z.array(
  z.object({
    total: z.number(),
    translated: z.number(),
    namespace: z.string(),
    percentage: z.number(),
  }),
);

export type ResponseGetTranslationsStatistics = z.infer<
  typeof ResponseGetTranslationsStatistics
>;
