import TranslationDataRow from './TranslationDataRow';
import { ResponseGetTranslationData } from '../../data/models/ResponseGetTranslationData';

const TranslationsTable = (props: {
  locales: string[] | undefined;
  translations: ResponseGetTranslationData | undefined;
}) => {
  const { locales, translations } = props;

  return (
    <div className="space-y-4">
      {translations?.data.map((translation) => (
        <TranslationDataRow
          data={translation}
          key={`${translation.namespace}.${translation.key}`}
          locales={locales ?? []}
        />
      ))}
    </div>
  );
};

export default TranslationsTable;
