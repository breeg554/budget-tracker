import React, { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { uid } from 'uid';
import { useBoolean, useDebounceValue } from 'usehooks-ts';

import {
  FiltersDrawer,
  OnSubmitProps,
} from '~/dashboard/organization/receipts/filters/components/FiltersDrawer';
import { SearchInput } from '~/inputs/SearchInput';
import { Pagination } from '~/pagination/pagination.utils';

import { loader } from './loader.server';

export const ReceiptsFilters = () => {
  const [key, setKey] = useState(uid());
  const { value: open, setValue: setOpen } = useBoolean(false);
  const { onFilter } = useOutletContext<{
    onFilter: (args: Partial<Pagination<{ category: string[] }>>) => void;
  }>();

  const {
    search: defaultSearch,
    category,
    author,
  } = useLoaderData<typeof loader>();

  const [search, setSearch] = useState<string | undefined>(defaultSearch);
  const [debouncedSearch] = useDebounceValue(search, 500);

  const submit = (args: OnSubmitProps) => {
    onFilter({ search: debouncedSearch, ...args });
  };

  const onSearchClear = () => {
    setSearch('');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearch === defaultSearch) return;
    submit({ category: category ?? [], author: author ?? [] });
  }, [debouncedSearch]);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  useEffect(() => {
    setKey(uid());
  }, [open]);

  return (
    <div className="flex justify-between items-center gap-1">
      <SearchInput
        placeholder="Search..."
        onChange={onChange}
        onClear={onSearchClear}
        value={search}
      />

      <FiltersDrawer
        key={key}
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={submit}
      />
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
