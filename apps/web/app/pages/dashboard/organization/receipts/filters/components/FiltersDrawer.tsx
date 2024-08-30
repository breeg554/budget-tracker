import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { FilterIcon } from 'lucide-react';

import { GetUserDto } from '~/api/api.types';
import { GetTransactionItemCategoryDto } from '~/api/Transaction/transactionApi.types';
import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import { loader } from '~/dashboard/organization/receipts/filters/loader.server';
import { ItemList } from '~/list/ItemList';
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

export type OnSubmitProps = {
  category: string[];
  author: string[];
};

interface ReceiptsFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: ({ category }: OnSubmitProps) => void;
}

export function FiltersDrawer({
  open,
  onOpenChange,
  onSubmit,
}: ReceiptsFiltersProps) {
  const {
    categories: allCategories,
    organizationUsers: allUsers,
    category,
    author,
  } = useLoaderData<typeof loader>();

  const [categories, setCategories] = useState<string[]>(category ?? []);
  const [authors, setAuthors] = useState<string[]>(author ?? []);

  const submit = () => {
    onSubmit({ category: categories, author: authors });
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((category) => category !== id);
      }

      return [...prev, id];
    });
  };

  const toggleAuthor = (id: string) => {
    setAuthors((prev) => {
      if (prev.includes(id)) {
        return prev.filter((author) => author !== id);
      }

      return [...prev, id];
    });
  };

  const isAuthorChecked = (id: string) => authors.includes(id);

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
          <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
            <FilterWrapper>
              <FilterHeading>Authors</FilterHeading>

              <ItemList
                className="flex flex-col gap-1"
                items={allUsers}
                renderItem={(item) => (
                  <AuthorsFilterItem
                    data={item}
                    onCheckedChange={toggleAuthor}
                    checked={isAuthorChecked(item.id)}
                  />
                )}
              />
            </FilterWrapper>

            <FilterWrapper>
              <FilterHeading>Categories</FilterHeading>

              <ItemList
                className="flex flex-wrap gap-1"
                items={allCategories}
                renderItem={(item) => (
                  <CategoriesFilterItem
                    data={item}
                    onCheckedChange={toggleCategory}
                    checked={isCategoryChecked(item.id)}
                  />
                )}
              />
            </FilterWrapper>
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

interface CategoriesFilterItemProps {
  data: GetTransactionItemCategoryDto;
  checked: boolean;
  onCheckedChange: (id: string) => void;
}
function CategoriesFilterItem({
  data,
  checked,
  onCheckedChange,
}: CategoriesFilterItemProps) {
  const category = new TransactionItemCategory(data);
  return (
    <label className="cursor-pointer flex gap-1 items-center relative pl-1 pr-2 rounded-full border border-input text-sm has-[button[data-state=checked]]:bg-accent-foreground has-[button[data-state=checked]]:text-white has-[button[data-state=checked]]:border-accent-foreground">
      <Checkbox
        className="opacity-0 pointer-events-none absolute top-0 left-0"
        checked={checked}
        onCheckedChange={() => onCheckedChange(category.id)}
      />
      <span>{category.icon}</span>

      <span className="line-clamp-1 max-w-[130px]" title={category.name}>
        {category.name}
      </span>
    </label>
  );
}

interface AuthorsFilterItemProps {
  data: GetUserDto;
  checked: boolean;
  onCheckedChange: (id: string) => void;
}
function AuthorsFilterItem({
  data,
  checked,
  onCheckedChange,
}: AuthorsFilterItemProps) {
  return (
    <label className="flex items-center gap-1">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onCheckedChange(data.id)}
      />

      <span className="line-clamp-1" title={data.email}>
        {data.email}
      </span>
    </label>
  );
}

function FilterHeading({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className="text-xs " {...rest}>
      {children}
    </h4>
  );
}

function FilterWrapper({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col gap-1 " {...rest}>
      {children}
    </div>
  );
}
