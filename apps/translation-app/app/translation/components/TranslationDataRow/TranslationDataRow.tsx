'use client';

import { useRef } from 'react';

import {
  faBan,
  faCheck,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Role } from 'enums/Role.enum';

import TripleDotMenu from '@apps/translation-app/components/TripleDots/TripleDotMenu';
import { useClickOutside } from '@apps/translation-app/hooks/clickoutside.hooks';
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
    haveTooltip,
    isShowTooltip,
    setIsShowTooltip,
  } = useTranslationDataRowViewModel({ item, languages, accessToken, role });

  const tooltipRef = useRef<HTMLDivElement>(null);
  useClickOutside(isShowTooltip, [tooltipRef], () => {
    setIsShowTooltip(false);
  });

  return (
    <tr
      key={item.key}
      className={classNames(styles.row, {
        [styles.notTranslated]: !translated || item.needToVerify,
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

          {haveTooltip && (
            <div
              className={styles.tooltipContainer}
              onClick={() => {
                setIsShowTooltip(!isShowTooltip);
              }}
              ref={tooltipRef}
            >
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-amber-500"
              />

              {isShowTooltip && (
                <div className={styles.tooltip}>
                  {item.needToVerify && (
                    <p>
                      The base language value (en) is changed. Please verify the
                      translation. Or you can ignore by clicking{' '}
                      <span
                        onClick={() => {
                          ignoreTranslation(item.key);
                        }}
                        className="text-blue-500 cursor-pointer"
                      >
                        here
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <TripleDotMenu
            menus={[
              {
                label: 'Ignore',
                onClick: () => ignoreTranslation(item.key),
                disabled: translated || !item.needToVerify,
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
