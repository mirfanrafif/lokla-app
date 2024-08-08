import React from 'react';
import { TranslationData } from '../../data/models/TranslationData';
import { IconButton, Tag, Td, Textarea, Tr, Text } from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { CheckIcon } from '@chakra-ui/icons';
import { useUpdateTranslation } from '../../usecases/UpdateTranslationUseCase';

type TranslationDataRowForm = {
  key: string;
  translations: {
    locale: string;
    value: string;
  }[];
};

const TranslationDataRow = (props: {
  data: TranslationData;
  locales: string[];
}) => {
  const form = useForm<TranslationDataRowForm>({
    defaultValues: {
      key: props.data.key,
      translations: props.locales.map((locale) => ({
        locale,
        value:
          props.data.translations.find((t) => t.locale === locale)?.value ?? '',
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });

  const updateTranslation = useUpdateTranslation();

  return (
    <Tr>
      <Td className="w-[300px]">
        <div className="space-y-2">
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

          {!props.data.translated && (
            <Tag colorScheme="red">Not Translated</Tag>
          )}
        </div>
      </Td>
      {fields.map((translation, index) => (
        <Td key={translation.locale}>
          <Textarea {...form.register(`translations.${index}.value`)} />
        </Td>
      ))}
      <Td>
        {form.formState.isDirty && (
          <IconButton
            aria-label="Done"
            isDisabled={updateTranslation.isPending}
            onClick={form.handleSubmit((data) => {
              updateTranslation.mutate({
                newKey: data.key,
                oldKey: props.data.key,
                project: props.data.project,
                namespace: props.data.namespace,
                translations: data.translations.map((translation) => ({
                  locale: translation.locale,
                  value: translation.value,
                })),
              });
            })}
          >
            <CheckIcon />
          </IconButton>
        )}
      </Td>
    </Tr>
  );
};

export default TranslationDataRow;
