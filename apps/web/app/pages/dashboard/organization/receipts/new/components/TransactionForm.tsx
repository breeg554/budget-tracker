import React, { ButtonHTMLAttributes, ReactNode, useEffect } from 'react';
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
import { Button } from '~/buttons/Button';
import { FormPersistentState } from '~/components/form/FormPersistentState';
import { ScanLink } from '~/dashboard/layout/components/ScanLink';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { DateField } from '~/form/fields/DateField';
import { HiddenField } from '~/form/fields/HiddenField';
import { SubmitButton } from '~/form/SubmitButton';
import { ValidatedForm } from '~/form/ValidatedForm';
import { PlusIcon } from '~/icons/PlusIcon';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger,
} from '~/ui/dialog-drawer';
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

  const insertItem = (values: CreateTransactionItemDto) => {
    form.insert({
      name: fields.items.name,
      // @ts-ignore
      defaultValue: values,
    });
  };

  const onEditItem = (updated: CreateTransactionItemDto, key?: string) => {
    form.update({
      name: fields.items.name,
      value: items.map((item) => {
        if (item.key === key) return updated;
        return item.value;
      }),
    });
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
                item={item}
                categories={itemCategories}
                onEdit={(updated) => onEditItem(updated, item.key)}
              />
            );
          })}

          <li onSubmit={(e) => e.stopPropagation()}>
            <TransactionFormItemDrawer
              title="New product"
              description="Add new receipt product"
              trigger={(open) => <InsertItemButton onClick={open} />}
            >
              {(close) => (
                <>
                  <TransactionItemForm
                    formId="new-item-form"
                    onSubmit={(values) => {
                      insertItem(values);
                      close();
                    }}
                    categories={itemCategories}
                  />
                  <div className="px-1">
                    <SubmitButton form="new-item-form">
                      Add product
                    </SubmitButton>
                  </div>
                </>
              )}
            </TransactionFormItemDrawer>
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
  item: FieldMetadata<CreateTransactionItemDto>;
  categories: GetTransactionItemCategoryDto[];
  onEdit?: (item: CreateTransactionItemDto) => void;
}

function TransactionFormItem({
  item,
  categories,
  onEdit,
}: TransactionFormItemProps) {
  const itemFields = item.getFieldset();

  const { value: name } = useInputControl(itemFields.name);
  const { value: category } = useInputControl(itemFields.category);
  const { value: quantity } = useInputControl(itemFields.quantity);
  const { value: price } = useInputControl(itemFields.price);
  useInputControl(itemFields.type);

  const findCategoryName = (id?: string) => {
    return categories.find((category) => category.id === id)?.name;
  };

  return (
    <li
      onSubmit={(e) => e.stopPropagation()}
      className="bg-neutral-50 border border-neutral-150 rounded p-2 text-sm text-neutral-900"
    >
      <p>Name: {name}</p>
      <p>Category: {findCategoryName(category) ?? ''}</p>
      <p>Amount: {quantity}</p>
      <p>Value: {price}</p>

      <TransactionFormItemDrawer
        title="Edit product"
        description="Edit receipt product"
        trigger={(open) => <Button onClick={open}>Edit</Button>}
      >
        {(close) => (
          <>
            <TransactionItemForm
              formId="update-item-form"
              onSubmit={(values) => {
                onEdit?.(values);
                close();
              }}
              categories={categories}
              defaultValues={{
                name,
                category,
                quantity: quantity ? Number(quantity) : undefined,
                price: price ? Number(price) : undefined,
              }}
            />

            <div className="px-1">
              <SubmitButton form="update-item-form">Update</SubmitButton>
            </div>
          </>
        )}
      </TransactionFormItemDrawer>
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
        value = value + Number(item.value.price) * Number(item.value.quantity);
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

interface TransactionFormItemDrawerProps {
  title: ReactNode;
  description: ReactNode;
  children: (close: () => void) => ReactNode;
  trigger: (open: () => void) => ReactNode;
}

function TransactionFormItemDrawer({
  children,
  title,
  description,
  trigger,
}: TransactionFormItemDrawerProps) {
  const { value: open, setFalse, setTrue } = useBoolean(false);

  const close = (value: boolean) => {
    if (value) return;
    setFalse();
  };

  return (
    <DialogDrawer open={open} onOpenChange={close}>
      <DialogDrawerTrigger asChild>{trigger(setTrue)}</DialogDrawerTrigger>
      <DialogDrawerContent>
        <DialogDrawerHeader>
          <DialogDrawerTitle>{title}</DialogDrawerTitle>
          <DialogDrawerDescription>{description}</DialogDrawerDescription>
        </DialogDrawerHeader>

        <DialogDrawerBody>{children(() => close(false))}</DialogDrawerBody>
      </DialogDrawerContent>
    </DialogDrawer>
  );
}
