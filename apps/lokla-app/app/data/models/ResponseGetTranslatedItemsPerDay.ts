import { z } from 'zod';

export const responseGetTranslatedItemsPerDaySchema = z.array(
  z.object({
    _id: z.string(),
    total: z.number(),
  })
);

export type ResponseGetTranslatedItemsPerDay = z.infer<
  typeof responseGetTranslatedItemsPerDaySchema
>;
