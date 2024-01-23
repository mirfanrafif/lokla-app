import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usePopup } from 'apps/translation-app/hooks/popup.hooks';
import { request } from 'apps/translation-app/lib/apiClient';

import { RequestUpdateTranslation } from '../../models/RequestUpdateTranslation';
import { TranslationData } from '../../models/TranslationData';
import DeleteTranslationConfirmationPopup from '../DeleteTranslationConfirmationPopup/DeleteTranslationConfirmationPopup';
import { TranslationDataRowProps } from './TranslationDataRow';

export const useTranslationDataRowViewModel = ({
  item,
  languages,
  accessToken,
}: TranslationDataRowProps) => {
  const router = useRouter();
  const { openPopup, closePopup } = usePopup();

  const defaultValues = useMemo(
    () => ({
      ...item,
      translations: languages.map((lang) => {
        const existingTranslation = item.translations.find(
          (translationFind) => translationFind.locale === lang,
        );
        if (!existingTranslation) {
          return {
            language: lang,
            value: '',
          };
        }
        return existingTranslation;
      }),
    }),
    [item, languages],
  );

  const form = useForm<TranslationData>({
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });

  const onSubmit = form.handleSubmit((data) => {
    const requestData: RequestUpdateTranslation = {
      oldKey: item.key,
      newKey: data.key,
      namespace: item.namespace,
      project: item.project,
      translations: data.translations,
    };

    return request(
      `/translations`,
      {
        body: JSON.stringify(requestData),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      accessToken,
    )
      .then((response) => {
        toast.success('Success updating translations');
        form.reset({
          key: data.key,
          translations: data.translations,
        });
      })
      .catch((error) => {
        toast.error(`Error updating translations: ${error.message}`);
      });
  });

  const translated = useMemo(() => {
    return item.translated;
  }, [item.translated]);

  const resetTranslation = () => {
    form.reset(defaultValues);
  };
  const deleteTranslation = () => {
    openPopup(
      <DeleteTranslationConfirmationPopup
        onConfirm={() => {
          deleteTranslationAction(item.key);
        }}
        onCancel={() => {
          closePopup();
        }}
      />,
    );
  };

  const deleteTranslationAction = (key: string) => {
    request(`/translations?key=${key}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        closePopup();
        router.refresh();
      })
      .catch((error) => {
        toast.error(`Error updating translations: ${error.message}`);
        closePopup();
      });
  };
  return {
    form,
    fields,
    onSubmit,
    resetTranslation,
    deleteTranslation,
    translated,
  };
};
