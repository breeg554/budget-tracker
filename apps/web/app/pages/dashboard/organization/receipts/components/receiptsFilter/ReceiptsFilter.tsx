import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { useBoolean, useDebounceValue } from 'usehooks-ts';

import { GetUserDto } from '~/api/api.types';
import { GetTransactionItemCategoryDto } from '~/api/Transaction/transactionApi.types';
import { SearchInput } from '~/inputs/SearchInput';
import { Pagination } from '~/pagination/pagination.utils';

import { DrawerFilters, FiltersDrawer, OnSubmitProps } from './FiltersDrawer';

interface ReceiptsFiltersProps {
  onFilter: (args: Partial<Pagination<{ category: string[] }>>) => void;
  defaultValues: DrawerFilters & { search?: string };
  authors: GetUserDto[];
  categories: GetTransactionItemCategoryDto[];
}

export const ReceiptsFilters = ({
  onFilter,
  defaultValues,
  categories,
  authors,
}: ReceiptsFiltersProps) => {
  const [key, setKey] = useState(uid());
  const { value: open, setValue: setOpen } = useBoolean(false);

  const {
    search: defaultSearch,
    category,
    author,
    startDate,
    endDate,
  } = defaultValues;

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

    submit({
      category: category ?? [],
      author: author ?? [],
      startDate,
      endDate,
    });
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
        defaultValues={defaultValues}
        categories={categories}
        authors={authors}
      />
    </div>
  );
};
