import { TranslationData } from '../../data/models/TranslationData';
import {
  IconButton,
  Tag,
  Textarea,
  Text,
  Badge,
  Card,
  FormErrorMessage,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useRemixForm } from 'remix-hook-form';
import { CheckIcon } from '@chakra-ui/icons';

import { Form } from '@remix-run/react';
import { useFieldArray } from 'react-hook-form';

import { Locales } from 'lib/constants/locales';
import {
  TranslationDataRowForm,
  translationFormResolver,
} from '../../data/models/TranslationForm';
import { useEffect } from 'react';

const TranslationDataRow = (props: {
  data: TranslationData;
  locales: string[];
}) => {
  const form = useRemixForm<TranslationDataRowForm>({
    defaultValues: {
      key: props.data.key,
      namespace: props.data.namespace,
      translations: props.locales.map((locale) => ({
        locale,
        value:
          props.data.translations.find((t) => t.locale === locale)?.value ?? '',
      })),
    },
    mode: 'onSubmit',
    resolver: translationFormResolver,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
    keyName: 'formKey',
  });

  useEffect(() => {
    form.reset({
      key: props.data.key,
      namespace: props.data.namespace,
      translations: props.locales.map((locale) => ({
        locale,
        value:
          props.data.translations.find((t) => t.locale === locale)?.value ?? '',
      })),
    });
  }, [props.data]);

  console.log(form.formState.isSubmitting);

  return (
    <Form onSubmit={form.handleSubmit} method="POST">
      <Card className="p-4">
        {/* id */}
        <input type="hidden" {...form.register('key')} />
        <div className="flex flex-row gap-4">
          <div className="w-[300px]">
            <div className="space-y-2">
              <Badge>{props.data.namespace}</Badge>
              <Text className="w-[200px] whitespace-pre-wrap">
                {props.data.key.split('.').map((item, index, arr) => (
                  <>
                    <span>{item}</span>
                    {index !== arr.length - 1 && (
                      <span className="text-gray-400">.</span>
                    )}
                  </>
                ))}
              </Text>

              <div>
                {!props.data.translated && (
                  <Tag colorScheme="red">Not Translated</Tag>
                )}
                {props.data.unused && <Tag colorScheme="red">Unused</Tag>}
              </div>
            </div>
          </div>
          {fields.map((translation, index) => (
            <FormControl
              key={translation.formKey}
              isInvalid={!!form.formState.errors.translations?.[index]?.value}
            >
              <input
                type="hidden"
                {...form.register(`translations.${index}.locale`)}
              />
              <FormLabel>
                {Locales.find((locale) => translation.locale == locale.code)
                  ?.name ?? `${translation.locale} (Custom Language)`}
              </FormLabel>
              <Textarea
                {...form.register(`translations.${index}.value`)}
                className="flex-1"
              />
              {form.formState.errors.translations?.[index]?.value?.message && (
                <FormErrorMessage>
                  {form.formState.errors.translations?.[index]?.value?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          ))}
          <div className="w-[100px]">
            {form.formState.isDirty && (
              <IconButton
                aria-label="Done"
                type="submit"
                isDisabled={form.formState.isSubmitting}
              >
                <CheckIcon />
              </IconButton>
            )}
          </div>
        </div>
      </Card>
    </Form>
  );
};

export default TranslationDataRow;
