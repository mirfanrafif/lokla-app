import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useSearchParams } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

const TranslationFilter = (props: { namespaces: string[] | undefined }) => {
  const [params, setParams] = useSearchParams();

  const timeoutRef = useRef<NodeJS.Timeout>();

  const [search, setSearch] = useState(params.get('search') ?? '');

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setParams({
        ...Object.fromEntries(params),
        search: search,
      });
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 items-stretch lg:items-end">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        backgroundColor={'white'}
        className="w-full"
      />

      <FormControl>
        <FormLabel htmlFor="filter">Filter:</FormLabel>
        <Select
          value={params.get('filter') ?? 'all'}
          onChange={(e) =>
            setParams({ ...Object.fromEntries(params), filter: e.target.value })
          }
          className="w-full lg:w-[200px]"
          backgroundColor={'white'}
          id="filter"
        >
          <option value="all">All</option>

          <option value="not_translated">Untranslated</option>

          <option value="unused">Unused</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="namespace">Namespace:</FormLabel>

        <Select
          value={params.get('namespace') ?? 'all'}
          onChange={(e) =>
            setParams({
              ...Object.fromEntries(params),
              namespace: e.target.value !== 'all' ? e.target.value : '',
            })
          }
          className="w-full lg:w-[200px]"
          backgroundColor={'white'}
          id="namespace"
        >
          <option value="all">All</option>

          {props.namespaces?.map((namespace) => (
            <option key={namespace} value={namespace}>
              {namespace}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TranslationFilter;
