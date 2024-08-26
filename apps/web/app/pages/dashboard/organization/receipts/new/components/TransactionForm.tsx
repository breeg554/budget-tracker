import React, { ButtonHTMLAttributes, ReactNode } from 'react';
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
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '~/dropdowns/Dropdown';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { DateField } from '~/form/fields/DateField';
import { HiddenField } from '~/form/fields/HiddenField';
import { SubmitButton } from '~/form/SubmitButton';
import { ValidatedForm } from '~/form/ValidatedForm';
import { TrashIcon } from '~/icons/TrashIcon';
import { confirm } from '~/modals/confirm';
import { successToast } from '~/toasts/successToast';
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
import { TransactionItemCategory } from '~/utils/TransactionItemCategory';

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
    defaultValue: {
      date: new Date().toISOString(),
      ...defaultValue,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTransactionSchema });
    },
    shouldValidate: 'onSubmit',
  });

  const items = fields.items.getFieldList();

  const insertItem = (values: CreateTransactionItemDto) => {
    form.insert({
      name: fields.items.name,
      // @ts-ignore
      defaultValue: values,
    });

    successToast({
      title: 'Product added to the list',
      description: 'Close dialog or add more products.',
    });
  };

  const removeItem = (index: number) => {
    form.remove({
      name: fields.items.name,
      index,
    });

    successToast({
      title: 'Product removed',
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

    successToast({
      title: 'Product updated',
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
          <h2 className="text-muted-foreground text-sm">Transaction Items</h2>

          <ScanLink size="2" />
        </header>

        <ul className="flex flex-col gap-3 py-4">
          {items.map((item, index) => {
            return (
              <li key={item.key} onSubmit={(e) => e.stopPropagation()}>
                <TransactionFormItem
                  item={item}
                  categories={itemCategories}
                  onEdit={(updated) => onEditItem(updated, item.key)}
                  onDelete={() => removeItem(index)}
                />
              </li>
            );
          })}

          <li onSubmit={(e) => e.stopPropagation()}>
            <TransactionFormItemDrawer
              title="New"
              description="Add a new product to the list"
              trigger={(open) => (
                <InsertItemButton onClick={open} className="mt-2" />
              )}
            >
              {() => (
                <>
                  <TransactionItemForm
                    formId="new-item-form"
                    onSubmit={insertItem}
                    categories={itemCategories}
                  />
                  <SubmitButton form="new-item-form" className="mt-3 w-full">
                    Add product
                  </SubmitButton>
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
    <Button
      variant="outline"
      className={cn(className, 'w-full text-sm')}
      {...rest}
    >
      <span>Add New</span>
    </Button>
  );
}

interface TransactionFormItemProps {
  item: FieldMetadata<CreateTransactionItemDto>;
  categories: GetTransactionItemCategoryDto[];
  onEdit?: (item: CreateTransactionItemDto) => void;
  onDelete: () => void;
}

function TransactionFormItem({
  item,
  categories,
  onEdit,
  onDelete,
}: TransactionFormItemProps) {
  const itemFields = item.getFieldset();

  const { value: name } = useInputControl(itemFields.name);
  const { value: categoryId } = useInputControl(itemFields.category);
  const { value: quantity } = useInputControl(itemFields.quantity);
  const { value: price } = useInputControl(itemFields.price);
  useInputControl(itemFields.type);

  const findCategory = (id?: string) => {
    return categories.find((category) => category.id === id);
  };

  const category = findCategory(categoryId);
  const categoryItem = category ? new TransactionItemCategory(category) : null;
  const monetaryValue = new MonetaryValue(price ?? 0, quantity ?? 1);

  return (
    <article className="flex gap-2 justify-between items-center">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl text-xl bg-neutral-100 flex justify-center items-center shrink-0">
          {categoryItem ? categoryItem.icon : ''}
        </div>

        <div className="flex flex-col">
          <h4 className="text-foreground line-clamp-1" title={name}>
            {name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {categoryItem ? categoryItem.name : categoryId}
          </p>
        </div>
      </header>

      <div className="flex gap-6 justify-end items-center">
        <div className="flex flex-col items-center">
          <p className="text-foreground">
            -{monetaryValue.format()}
            <span className="text-xs">{monetaryValue.currency}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            ({monetaryValue.quantity.toFixed(2)} *{' '}
            {monetaryValue.amountPerUnit.toFixed(2)})
          </p>
        </div>

        <Dropdown>
          <DropdownTrigger />

          <DropdownContent>
            <TransactionFormItemDrawer
              title="Edit"
              description="Edit product details"
              trigger={(open) => (
                <DropdownItem
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                >
                  Edit
                </DropdownItem>
              )}
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
                      category: categoryId,
                      quantity: quantity ? Number(quantity) : undefined,
                      price: price ? Number(price) : undefined,
                    }}
                  />

                  <SubmitButton form="update-item-form" className="w-full mt-3">
                    Update
                  </SubmitButton>
                </>
              )}
            </TransactionFormItemDrawer>

            <DropdownItem
              variant="destructive"
              icon={<TrashIcon />}
              onClick={() => {
                confirm({
                  children: 'Are you sure you want to delete this product?',
                  onConfirm: onDelete,
                });
              }}
            >
              Delete
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </article>
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
