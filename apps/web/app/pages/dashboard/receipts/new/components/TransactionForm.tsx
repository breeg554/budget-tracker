import React, { ButtonHTMLAttributes } from "react";
import { ValidatedForm } from "~/form/ValidatedForm";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  FieldMetadata,
  SubmissionResult,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Dialog } from "@radix-ui/themes";
import { useBoolean } from "usehooks-ts";
import { Field } from "~/form/Field";
import { cn } from "~/utils/cn";
import { DateField } from "~/form/fields/DateField";
import { SubmitButton } from "~/form/SubmitButton";
import { HiddenField } from "~/form/fields/HiddenField";
import { FieldError, FieldLabel, TextField } from "~/form/fields";
import { TransactionItemForm } from "~/dashboard/receipts/new/components/TransactionItemForm";
import {
  CreateTransactionItemDto,
  GetTransactionItemCategoryDto,
} from "~/api/Transaction/transactionApi.types";
import {
  createTransactionSchema,
  TransactionType,
} from "~/api/Transaction/transactionApi.contracts";
import { MonetaryValue } from "~/utils/MonetaryValue";

interface TransactionFormProps {
  lastResult?: SubmissionResult | null;
  itemCategories: GetTransactionItemCategoryDto[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  lastResult,
  itemCategories,
}) => {
  const { value: isOpen, setFalse, toggle } = useBoolean(false);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTransactionSchema });
    },
    shouldValidate: "onSubmit",
  });

  const items = fields.items.getFieldList();

  const insertItem = (values: CreateTransactionItemDto) => {
    form.insert({
      name: fields.items.name,
      defaultValue: values,
    });
    form.validate();
    setFalse();
  };

  return (
    <ValidatedForm method="POST" form={form} onSubmit={form.onSubmit}>
      <SectionWrapper className="pb-8 pt-14">
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
            <TextField variant="soft" placeholder="eg. Shopping mall" />
            <FieldError />
          </Field>

          <Field name="date">
            <FieldLabel>Date</FieldLabel>
            <DateField variant="soft" />
            <FieldError />
          </Field>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <header className="flex justify-between gap-2 items-center">
          <h2>Items</h2>
        </header>

        <ul className="flex flex-col gap-2 py-4">
          {items.map((item) => {
            return (
              <TransactionFormItem
                key={item.key}
                field={item}
                categories={itemCategories}
              />
            );
          })}

          <li>
            <Dialog.Root open={isOpen} onOpenChange={toggle}>
              <Dialog.Trigger>
                <InsertItemButton />
              </Dialog.Trigger>

              <Dialog.Content
                className="max-w-xl w-full"
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Dialog.Title>New item</Dialog.Title>

                <TransactionItemForm
                  onSubmit={insertItem}
                  categories={itemCategories}
                />
              </Dialog.Content>
            </Dialog.Root>
          </li>
        </ul>
      </SectionWrapper>

      <SubmitButton>Add transaction</SubmitButton>
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
        "w-full bg-neutral-50 rounded p-2 text-sm text-neutral-800 border border-neutral-150 flex gap-1 items-center",
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
}

function TransactionFormItem({ field, categories }: TransactionFormItemProps) {
  const itemFields = field.getFieldset();
  const name = useInputControl(itemFields.name);
  const category = useInputControl(itemFields.category);
  const amount = useInputControl(itemFields.amount);
  const value = useInputControl(itemFields.value);
  useInputControl(itemFields.type);

  const findCategoryName = (id?: string) => {
    return categories.find((category) => category.id === id)?.name;
  };

  return (
    <li className="bg-neutral-50 border border-neutral-150 rounded p-2 text-sm text-neutral-900">
      <p>Name: {name.value}</p>
      <p>Category: {findCategoryName(category.value) ?? ""}</p>
      <p>Amount: {amount.value}</p>
      <p>Value: {value.value}</p>
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
        value = value + Number(item.value.value) * Number(item.value.amount);
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
