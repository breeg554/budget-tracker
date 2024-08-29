import React, { useEffect, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import { z } from 'zod';

import { GetTransactionItemCategoryDto } from '~/api/Transaction/transactionApi.types';
import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import { Label } from '~/inputs/Label';
import { SearchInput } from '~/inputs/SearchInput';
import { Checkbox } from '~/ui/checkbox';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerClose,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger,
} from '~/ui/dialog-drawer';
import { TransactionItemCategory } from '~/utils/TransactionItemCategory';

interface ReceiptsFilterProps {
  onFilter: (params: Record<string, string | number>) => void;
  defaultValues?: { search?: string; category?: string[] };
  categories: GetTransactionItemCategoryDto[];
}

export const ReceiptsFilter = ({
  onFilter,
  defaultValues,
  categories: allCategories,
}: ReceiptsFilterProps) => {
  const [categories, setCategories] = useState<string[]>(
    defaultValues?.category ?? [],
  );
  const [search, setSearch] = useState<string>(defaultValues?.search ?? '');
  const [debouncedSearch] = useDebounceValue(search, 500);

  const submit = () => {
    onFilter({ search: debouncedSearch, categories: categories.join(',') });
  };

  const onBlur = () => {
    submit();
  };

  const onSearchClear = () => {
    setSearch('');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((category) => category !== id);
      }

      return [...prev, id];
    });
  };

  const isCategoryChecked = (id: string) => categories.includes(id);

  useEffect(() => {
    if (debouncedSearch === defaultValues?.search) return;
    submit();
  }, [debouncedSearch]);

  const hasAdditionalFilters = !!defaultValues?.category;

  return (
    <div className="flex justify-between items-center gap-1">
      <SearchInput
        placeholder="Search..."
        onBlur={onBlur}
        onChange={onChange}
        onClear={onSearchClear}
        value={search}
      />

      <DialogDrawer>
        <DialogDrawerTrigger asChild>
          <IconButton
            icon={hasAdditionalFilters ? <span>+1</span> : <FilterIcon />}
            variant={hasAdditionalFilters ? 'default' : 'secondary'}
          />
        </DialogDrawerTrigger>
        <DialogDrawerContent>
          <DialogDrawerHeader>
            <DialogDrawerTitle>More filters</DialogDrawerTitle>
            <DialogDrawerDescription>
              Select more filters for better results
            </DialogDrawerDescription>
          </DialogDrawerHeader>

          <DialogDrawerBody>
            <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto">
              <Label>Categories</Label>

              <div className="flex flex-wrap gap-1">
                {allCategories.map((category) => {
                  const categoryItem = new TransactionItemCategory(category);
                  const isChecked = isCategoryChecked(category.id);

                  return (
                    <label
                      key={category.id}
                      className="cursor-pointer flex gap-1 items-center relative pl-1 pr-2 rounded-full border border-input text-sm has-[button[data-state=checked]]:bg-accent-foreground has-[button[data-state=checked]]:text-white has-[button[data-state=checked]]:border-accent-foreground"
                    >
                      <Checkbox
                        className="opacity-0 pointer-events-none absolute top-0 left-0"
                        checked={isChecked}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <span>{categoryItem.icon}</span>

                      <span
                        className="line-clamp-1 max-w-[130px]"
                        title={categoryItem.name}
                      >
                        {categoryItem.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogDrawerClose className="w-full mt-4" asChild>
              <Button size="sm" onClick={submit}>
                Show transactions
              </Button>
            </DialogDrawerClose>
          </DialogDrawerBody>
        </DialogDrawerContent>
      </DialogDrawer>
    </div>
  );
};
