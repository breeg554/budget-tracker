import React from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import {
  createTransactionItemSchema,
  TransactionItemType,
} from '~/api/Transaction/transactionApi.contracts';
import {
  CreateTransactionItemDto,
  GetTransactionItemCategoryDto,
} from '~/api/Transaction/transactionApi.types';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { ComboboxField } from '~/form/fields/ComboboxField';
import { HiddenField } from '~/form/fields/HiddenField';
import { NumberField } from '~/form/fields/NumberField';
import { ValidatedForm } from '~/form/ValidatedForm';
import { CheckIcon } from '~/icons/CheckIcon';
import { Category } from '~/utils/Category';
import { cn } from '~/utils/cn';

interface TransactionItemFormProps {
  onSubmit?: (values: CreateTransactionItemDto) => void;
  categories: GetTransactionItemCategoryDto[];
  defaultValues?: Partial<CreateTransactionItemDto>;
  formId?: string;
}

export const TransactionItemForm: React.FC<TransactionItemFormProps> = ({
  onSubmit,
  categories,
  defaultValues,
  formId,
}) => {
  const [form] = useForm({
    id: formId,
    defaultValue: { ...defaultValues, quantity: defaultValues?.quantity ?? 1 },
    shouldValidate: 'onSubmit',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTransactionItemSchema });
    },
    onSubmit: (e, { formData }) => {
      e.preventDefault();
      e.stopPropagation();

      const values: Record<string, unknown> = {};

      for (let [key, value] of formData.entries()) {
        values[key] = value;
      }

      onSubmit?.(values as CreateTransactionItemDto);
      e.currentTarget.reset();
    },
  });

  const categoryValues = categories.map((category) => ({
    ...category,
    value: category.id,
    label: category.name,
  }));

  return (
    <ValidatedForm form={form} className="flex flex-col gap-3">
      <HiddenField name="type" defaultValue={TransactionItemType.OUTCOME} />

      <Field formId={formId} name="name">
        <FieldLabel>Name</FieldLabel>
        <TextField placeholder="eg. Monster Energy" />
        <FieldError />
      </Field>

      <Field formId={formId} name="category">
        <FieldLabel>Category</FieldLabel>
        <ComboboxField
          options={categoryValues}
          renderOption={(option, isSelected) => (
            <CategoryOption
              isSelected={isSelected}
              data={
                new Category({
                  id: option.value,
                  name: option.label,
                })
              }
            />
          )}
        />
        <FieldError />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field formId={formId} name="price">
          <FieldLabel>Price</FieldLabel>
          <NumberField placeholder="e.g. 9.99" />
          <FieldError />
        </Field>

        <Field formId={formId} name="quantity">
          <FieldLabel>Quantity</FieldLabel>
          <NumberField placeholder="e.g. 2" />
          <FieldError />
        </Field>
      </div>
    </ValidatedForm>
  );
};

function CategoryOption({
  data,
  isSelected,
}: {
  data: Category;
  isSelected: boolean;
}) {
  return (
    <div className="w-full flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        {data.icon}
        <p>{data.name}</p>
      </div>

      <CheckIcon
        className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  );
}
