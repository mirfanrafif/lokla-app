'use client';

import { faBan, faCheck, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { TranslationData } from '../../models/TranslationData';
import styles from './TranslationDataRow.module.scss';
import { useTranslationDataRowViewModel } from './TranslationDataRow.viewModel';

export type TranslationDataRowProps = {
  item: TranslationData;
  languages: string[];
  accessToken: string | undefined;
  role: string | undefined;
};

export function TranslationDataRow({
  item,
  languages,
  accessToken,
  role,
}: TranslationDataRowProps) {
  const {
    form,
    fields,
    onSubmit,
    resetTranslation,
    deleteTranslation,
    translated,
  } = useTranslationDataRowViewModel({ item, languages, accessToken, role });

  return (
    <tr
      key={item.key}
      className={classNames(styles.row, {
        [styles.notTranslated]: !translated,
      })}
    >
      <td>
        <div className="h-full w-full text-black">
          {item.namespace}
        </div>
      </td>
      <td className={styles.key}>
        <textarea className="w-full" {...form.register('key')} />
      </td>
      {fields.map((field, index) => (
        <td key={index}>
          <textarea
            className="w-full"
            key={field.id}
            {...form.register(`translations.${index}.value`, {
              required: true,
            })}
            placeholder="(Empty)"
          />
        </td>
      ))}
      <td>
        <div className={styles.actionRow}>
          {form.formState.isDirty && (
            <>
              <button
                className={classNames(styles.actionButton, styles.update)}
                onClick={onSubmit}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className={classNames(styles.actionButton, styles.reset)}
                onClick={resetTranslation}
              >
                <FontAwesomeIcon icon={faBan} />
              </button>
            </>
          )}
          {!item.translated && (
            <button
              className={classNames(styles.actionButton, styles.ignore)}
              onClick={deleteTranslation}
              title="Ignore"
            >
              <FontAwesomeIcon icon={faForward} className="text-white" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
