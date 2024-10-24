import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const TranslationDataRowFormSchema = z.object({
  key: z.string().min(1),
  namespace: z.string().min(1),
  translations: z.array(
    z.object({
      locale: z.string().min(1, 'Locale must be valid'),
      value: z.string().min(1, 'Translation must be valid'),
    })
  ),
});

export type TranslationDataRowForm = z.infer<
  typeof TranslationDataRowFormSchema
>;
export const translationFormResolver = zodResolver(
  TranslationDataRowFormSchema
);
