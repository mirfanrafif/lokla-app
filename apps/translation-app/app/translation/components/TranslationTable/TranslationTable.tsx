import DoneImage from '@frontend/app/translation/images/done.png';
import Image from 'next/image';

import { languages } from 'constants/languages';

import { TranslationData } from '../../models/TranslationData';
import { getAccessToken, getRole } from '../../services/auth.service';
import { TranslationDataRow } from '../TranslationDataRow/TranslationDataRow';

import styles from './TranslationTable.module.scss';

export function TranslationTable(props: {
  translations: TranslationData[];
  languages: string[];
}) {
  const accessToken = getAccessToken();
  const role = getRole();

  return (
    <div className={styles.tableContainer}>
      <table className="w-full">
        <thead className={styles.tableHeader}>
          <tr>
            <th>Namespace / Domain</th>
            <th>Key</th>
            {languages.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {props.translations.map((item) => (
            <TranslationDataRow
              item={item}
              languages={props.languages}
              key={item.key}
              accessToken={accessToken}
              role={role}
            />
          ))}
        </tbody>
      </table>
      {props.translations.length === 0 && (
        <>
          <Image
            src={DoneImage}
            alt=""
            width={300}
            height={300}
            className="mx-auto mt-8"
          />
          <p className="text-center mb-8">
            {role === 'editor'
              ? "Yay! You're all caught up! All translations are up to date."
              : 'No translations found.'}
          </p>
        </>
      )}
    </div>
  );
}
