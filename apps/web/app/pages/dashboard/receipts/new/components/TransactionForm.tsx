import React, { ButtonHTMLAttributes } from "react";
import { ValidatedForm } from "~/form/ValidatedForm";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  FieldMetadata,
  getInputProps,
  SubmissionResult,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Field } from "~/form/Field";
import { FieldError, FieldLabel, TextField } from "~/form/fields";
import { DateField } from "~/form/fields/DateField";
import {
  CreateTransactionItemSchema,
  createTransactionSchema,
  TransactionItemType,
  TransactionType,
} from "~/api/Transaction/transactionApi.contracts";
import { SubmitButton } from "~/form/SubmitButton";
import { HiddenField } from "~/form/fields/HiddenField";
import { cn } from "~/utils/cn";
import { Dialog } from "@radix-ui/themes";
import { Button } from "~/buttons/Button";
import { TransactionItemForm } from "~/dashboard/receipts/new/components/TransactionItemForm";
import { useBoolean } from "usehooks-ts";

interface TransactionFormProps {
  lastResult?: SubmissionResult | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  lastResult,
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
  const props = form.insert.getButtonProps({ name: fields.items.name });
  console.log(props);

  const insertItem = (values: CreateTransactionItemSchema) => {
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
        <h1 className="text-5xl font-bold w-full text-center">
          {22.12}
          <span className="text-xl">$</span>
        </h1>

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
            return <TransactionFormItem key={item.key} field={item} />;
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

                <TransactionItemForm onSubmit={insertItem} />

                {/*<Dialog.Close>*/}
                {/*  <Button variant="soft" color="gray">*/}
                {/*    Cancel*/}
                {/*  </Button>*/}
                {/*</Dialog.Close>*/}
                {/*<Dialog.Close>*/}
                {/*  <Button>Save</Button>*/}
                {/*</Dialog.Close>*/}
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
  field: FieldMetadata<CreateTransactionItemSchema>;
}

function TransactionFormItem({ field }: TransactionFormItemProps) {
  const itemFields = field.getFieldset();
  const name = useInputControl(itemFields.name);
  const category = useInputControl(itemFields.category);
  const amount = useInputControl(itemFields.amount);
  const value = useInputControl(itemFields.value);

  return (
    <li className="bg-neutral-50 border border-neutral-150 rounded p-2 text-sm text-neutral-900">
      <p>Name: {name.value}</p>
      <p>Category: {category.value}</p>
      <p>Amount: {amount.value}</p>
      <p>Value: {value.value}</p>
    </li>
  );
}
