import { Table, Thead, Tr, Th, Tbody, TableContainer } from '@chakra-ui/react';
import TranslationDataRow from './TranslationDataRow';
import { Locales } from 'lib/constants/locales';
import { ResponseGetTranslationData } from '../../data/models/ResponseGetTranslationData';

const TranslationsTable = (props: {
  locales: string[] | undefined;
  translations: ResponseGetTranslationData | undefined;
}) => {
  const { locales, translations } = props;

  return (
    <TableContainer className="bg-white">
      <Table>
        <Thead>
          <Tr>
            <Th>Key</Th>
            {locales?.map((locale) => (
              <Th key={locale}>
                {Locales.find((localeItem) => localeItem.code === locale)
                  ?.name ?? locale}
              </Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {translations?.data.map((translation) => (
            <TranslationDataRow
              data={translation}
              key={`${translation.namespace}.${translation.key}`}
              locales={locales ?? []}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TranslationsTable;
