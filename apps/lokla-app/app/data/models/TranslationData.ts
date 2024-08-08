import { TranslationChangeLogEvent } from 'lib/enums/TranslationChangeLogEvent';
import * as z from 'zod';

export const TranslationItemSchema = z.object({
  locale: z.string(),
  value: z.string(),
});

export type TranslationItem = z.infer<typeof TranslationItemSchema>;

export const TranslationChangeLogSchema = z
  .array(
    z
      .object({
        eventType: z.nativeEnum(TranslationChangeLogEvent),
        before: z.string(),
        after: z.string(),
        locale: z.string().nullable(),
        date: z.string(),
      })
      .transform((data) => ({
        ...data,
        date: new Date(data.date),
        locale: data.locale ?? '',
      }))
  )
  .optional();

export type TranslationChangeLog = z.infer<typeof TranslationChangeLogSchema>;

export const TranslationDataSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  project: z.string(),
  translations: z.array(TranslationItemSchema),
  translated: z.boolean().optional(),
  changeLogs: TranslationChangeLogSchema,
  unused: z.boolean().optional().nullable(),
  needToVerify: z.boolean().optional(),
});

export type TranslationData = z.infer<typeof TranslationDataSchema>;
