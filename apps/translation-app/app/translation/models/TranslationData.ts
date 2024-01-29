import { TranslationChangeLogEvent } from 'enums/TranslationChangeLogEvent';
import * as z from 'zod';

export const TranslationChangeLogSchema = z
  .array(
    z
      .object({
        eventType: z.nativeEnum(TranslationChangeLogEvent),
        before: z.string(),
        after: z.string(),
        locale: z.string(),
        date: z.string(),
      })
      .transform((data) => ({
        ...data,
        date: new Date(data.date),
      })),
  )
  .optional();

export type TranslationChangeLog = z.infer<typeof TranslationChangeLogSchema>;

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
  changeLogs: TranslationChangeLogSchema,
});

export type TranslationData = z.infer<typeof TranslationDataSchema>;
