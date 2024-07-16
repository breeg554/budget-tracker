import React, { ButtonHTMLAttributes, useEffect, useState } from 'react';
import {
  FieldMetadata,
  SubmissionResult,
  useForm,
  useInputControl,
} from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useBoolean } from 'usehooks-ts';

import {
  createTransactionSchema,
  TransactionType,
} from '~/api/Transaction/transactionApi.contracts';
import {
  CreateTransactionDto,
  CreateTransactionItemDto,
  GetTransactionItemCategoryDto,
} from '~/api/Transaction/transactionApi.types';
import { FormPersistentState } from '~/components/form/FormPersistentState';
import { ScanLink } from '~/dashboard/layout/components/ScanLink';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { DateField } from '~/form/fields/DateField';
import { HiddenField } from '~/form/fields/HiddenField';
import { ValidatedForm } from '~/form/ValidatedForm';
import { PlusIcon } from '~/icons/PlusIcon';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/ui/drawer';
import { cn } from '~/utils/cn';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { TransactionItemForm } from './TransactionItemForm';

interface TransactionFormProps {
  lastResult?: SubmissionResult | null;
  itemCategories: GetTransactionItemCategoryDto[];
  defaultValue?: Partial<CreateTransactionDto>;
  id?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  lastResult,
  itemCategories,
  defaultValue,
  id,
}) => {
  const [editableField, setEditableField] =
    useState<null | FieldMetadata<CreateTransactionItemDto>>(null);
  const { value: isOpen, setFalse, setTrue, setValue } = useBoolean(false);

  const [form, fields] = useForm({
    id: id,
    lastResult,
    defaultValue,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTransactionSchema });
    },
    shouldValidate: 'onSubmit',
  });

  useEffect(() => {
    if (!defaultValue) return;

    form.update({
      name: fields.items.name,
      value: defaultValue.items,
    });
  }, [defaultValue]);

  const items = fields.items.getFieldList();
  const closeDialog = () => {
    setFalse();
    setEditableField(null);
    form.validate();
  };

  const insertItem = (values: CreateTransactionItemDto) => {
    form.insert({
      name: fields.items.name,
      // @ts-ignore
      defaultValue: values,
    });
    closeDialog();
  };

  const updateItem = (updated: CreateTransactionItemDto) => {
    if (!editableField) return;

    form.update({
      name: fields.items.name,
      value: items.map((item) => {
        if (item.key === editableField.key) return updated;
        return item.value;
      }),
    });
    closeDialog();
  };

  const onEditItem = (item: FieldMetadata<CreateTransactionItemDto>) => {
    setEditableField(item);
    setTrue();
  };

  const handleOnToggle = (value: boolean) => {
    setValue(value);
  };

  return (
    <ValidatedForm id={id} method="POST" form={form} onSubmit={form.onSubmit}>
      <FormPersistentState />

      <div className="pb-8 pt-14">
        <TransactionFormSummaryValue field={fields.items} />

        <div className="w-full flex flex-col gap-2 mt-6">
          <HiddenField name="value" defaultValue={10} formId={form.id} />
          <HiddenField
            name="type"
            defaultValue={TransactionType.PURCHASE}
            formId={form.id}
          />

          <Field name="name">
            <FieldLabel>Name</FieldLabel>
            <TextField placeholder="eg. Shopping mall" />
            <FieldError />
          </Field>

          <Field name="date">
            <FieldLabel>Date</FieldLabel>
            <DateField />
            <FieldError />
          </Field>
        </div>
      </div>

      <div>
        <header className="flex justify-between gap-2 items-center">
          <h2>Items</h2>

          <ScanLink size="2" />
        </header>

        <ul className="flex flex-col gap-2 py-4">
          {items.map((item) => {
            return (
              <TransactionFormItem
                key={item.key}
                field={item}
                categories={itemCategories}
                onEdit={onEditItem}
              />
            );
          })}

          <li>
            <Drawer open={isOpen} onOpenChange={handleOnToggle}>
              <DrawerTrigger asChild>
                <InsertItemButton />
              </DrawerTrigger>
              <DrawerContent
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DrawerHeader>
                  <DrawerTitle>New item</DrawerTitle>
                </DrawerHeader>
                <TransactionItemForm
                  onSubmit={editableField ? updateItem : insertItem}
                  categories={itemCategories}
                  defaultValues={
                    editableField?.value as CreateTransactionItemDto
                  }
                />
              </DrawerContent>
            </Drawer>
          </li>
        </ul>
      </div>
    </ValidatedForm>
  );
};

function InsertItemButton({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'w-full bg-neutral-50 rounded p-2 text-sm text-neutral-800 border border-neutral-150 flex gap-1 items-center',
        className,
      )}
      {...rest}
    >
      <PlusIcon />
      <span>Add new item</span>
    </button>
  );
}

interface TransactionFormItemProps {
  field: FieldMetadata<CreateTransactionItemDto>;
  categories: GetTransactionItemCategoryDto[];
  onEdit?: (item: FieldMetadata<CreateTransactionItemDto>) => void;
}

function TransactionFormItem({
  field,
  categories,
  onEdit,
}: TransactionFormItemProps) {
  const itemFields = field.getFieldset();

  const { value: name } = useInputControl(itemFields.name);
  const category = useInputControl(itemFields.category);
  const quantity = useInputControl(itemFields.quantity);
  const value = useInputControl(itemFields.value);
  useInputControl(itemFields.type);

  const findCategoryName = (id?: string) => {
    return categories.find((category) => category.id === id)?.name;
  };

  const handleOnEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(field);
  };

  return (
    <li className="bg-neutral-50 border border-neutral-150 rounded p-2 text-sm text-neutral-900">
      <p>Name: {name}</p>
      <p>Category: {findCategoryName(category.value) ?? ''}</p>
      <p>Amount: {quantity.value}</p>
      <p>Value: {value.value}</p>

      <button type="button" onClick={handleOnEdit}>
        Edit
      </button>
    </li>
  );
}

interface TransactionFormSummaryValueProps {
  field: FieldMetadata<CreateTransactionItemDto[]>;
}

function TransactionFormSummaryValue({
  field,
}: TransactionFormSummaryValueProps) {
  const items = field.getFieldList();

  const getSumValue = () => {
    let value: number = 0;

    for (let item of items.values()) {
      if (item.value) {
        value = value + Number(item.value.value) * Number(item.value.quantity);
      }
    }

    return value;
  };

  const value = new MonetaryValue(getSumValue() ?? 0);

  return (
    <h1 className="text-5xl font-bold w-full text-center">
      {value.amount.toFixed(2)}
      <span className="text-xl">{value.currency}</span>
    </h1>
  );
}
