import { useMemo, useState } from 'react';

import { request } from '@frontend/lib/apiClient';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { RequestUpdateTranslation } from '../../models/RequestUpdateTranslation';
import { TranslationData } from '../../models/TranslationData';
import TranslationChangeLogPopup from '../TranslationChangeLogPopup/TranslationChangeLogPopup';
import { TranslationDataRowProps } from './TranslationDataRow';

export const useTranslationDataRowViewModel = ({
  item,
  languages,
  accessToken,
}: TranslationDataRowProps) => {
  const router = useRouter();
  const { openPopup } = usePopup();
  const [isShowTooltip, setIsShowTooltip] = useState(false);

  const defaultValues: TranslationData = useMemo(
    () => ({
      ...item,
      translations: languages.map((lang) => {
        const existingTranslation = item.translations.find(
          (translationFind) => translationFind.locale === lang,
        );
        if (!existingTranslation) {
          return {
            locale: lang,
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

  const haveTooltip = useMemo(() => {
    if (item.unused || item.needToVerify) {
      return true;
    }

    return false;
  }, [item.needToVerify, item.unused]);

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
        router.refresh();
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

  const ignoreTranslation = (key: string) => {
    request(
      `/translations/ignore?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      accessToken,
    )
      .then((response) => {
        toast.success('Translations ignored');
        router.refresh();
      })
      .catch((error) => {
        toast.error(`Error updating translations: ${error.message}`);
      });
  };

  const showChangelog = () => {
    openPopup(<TranslationChangeLogPopup changeLog={item.changeLogs} />);
  };

  return {
    form,
    fields,
    onSubmit,
    resetTranslation,
    ignoreTranslation,
    translated,
    showChangelog,
    haveTooltip,
    isShowTooltip,
    setIsShowTooltip,
  };
};
