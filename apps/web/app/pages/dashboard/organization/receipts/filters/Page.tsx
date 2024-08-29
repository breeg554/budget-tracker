import React, { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { FilterIcon } from 'lucide-react';
import { uid } from 'uid';
import { useBoolean, useDebounceValue } from 'usehooks-ts';

import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import { Label } from '~/inputs/Label';
import { SearchInput } from '~/inputs/SearchInput';
import { Pagination } from '~/pagination/pagination.utils';
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

import { loader } from './loader.server';

export const ReceiptsFilters = () => {
  const [key, setKey] = useState(uid());
  const { value: open, setValue: setOpen } = useBoolean(false);
  const { onFilter } = useOutletContext<{
    onFilter: (args: Partial<Pagination<{ category: string[] }>>) => void;
  }>();

  const { search: defaultSearch, category } = useLoaderData<typeof loader>();

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
    submit({ category: category ?? [] });
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

type OnSubmitProps = {
  category: string[];
};

interface ReceiptsFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: ({ category }: OnSubmitProps) => void;
}

function FiltersDrawer({ open, onOpenChange, onSubmit }: ReceiptsFiltersProps) {
  const { categories: allCategories, category } =
    useLoaderData<typeof loader>();

  const [categories, setCategories] = useState<string[]>(category ?? []);

  const submit = () => {
    onSubmit({ category: categories });
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

  const hasAdditionalFilters = category && category.length > 0;

  return (
    <DialogDrawer open={open} onOpenChange={onOpenChange}>
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
  );
}

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
