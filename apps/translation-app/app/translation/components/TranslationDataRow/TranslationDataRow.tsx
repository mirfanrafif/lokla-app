'use client';

import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Role } from 'enums/Role.enum';

import TripleDotMenu from '@apps/translation-app/components/TripleDots/TripleDotMenu';
import { TranslationData } from '../../models/TranslationData';
import { useTranslationDataRowViewModel } from './TranslationDataRow.viewModel';

import styles from './TranslationDataRow.module.scss';

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
    ignoreTranslation,
    translated,
    showChangelog,
  } = useTranslationDataRowViewModel({ item, languages, accessToken, role });

  return (
    <tr
      key={item.key}
      className={classNames(styles.row, {
        [styles.notTranslated]: !translated,
        [styles.deleted]: item.unused,
      })}
    >
      <td>
        <div className="h-full w-full text-black">{item.namespace}</div>
      </td>
      <td className={styles.key}>
        <textarea
          className="w-full"
          {...form.register('key')}
          disabled={role === Role.Editor}
        />
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
      <td className={styles.actions}>
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

          <TripleDotMenu
            menus={[
              {
                label: 'Ignore',
                onClick: () => ignoreTranslation(item.key),
                disabled: translated,
              },
              {
                label: 'Show Changelog',
                onClick: () => {
                  showChangelog();
                },
              },
            ]}
          />
        </div>
      </td>
    </tr>
  );
}
