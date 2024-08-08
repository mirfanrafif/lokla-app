import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
} from '@chakra-ui/react';
import { useSearchParams } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

const TranslationFilter = () => {
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
    <div className="flex flex-row w-full gap-4 items-end">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        backgroundColor={'white'}
      />

      <Select
        value={params.get('filter') ?? 'all'}
        onChange={(e) =>
          setParams({ ...Object.fromEntries(params), filter: e.target.value })
        }
        width={'200px'}
        backgroundColor={'white'}
      >
        <option value="all">All</option>

        <option value="not_translated">Untranslated</option>
      </Select>
    </div>
  );
};

export default TranslationFilter;
