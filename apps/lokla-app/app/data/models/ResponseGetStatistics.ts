import { z } from 'zod';

export const ResponseGetStatisticsSchema = z.array(
  z.object({
    total: z.number(),
    translated: z.number(),
    namespace: z.string(),
    percentage: z.number(),
  })
);

export type ResponseGetStatistics = z.infer<typeof ResponseGetStatisticsSchema>;
