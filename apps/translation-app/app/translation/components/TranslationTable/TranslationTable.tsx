import { languages } from 'constants/languages';

import { TranslationData } from '../../models/TranslationData';
import { TranslationDataRow } from '../TranslationDataRow/TranslationDataRow';
import styles from './TranslationTable.module.scss';
import { getAccessToken, getRole } from '../../services/auth.service';

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
    </div>
  );
}
