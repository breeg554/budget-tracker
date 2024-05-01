import React, { ReactNode } from "react";
import { ValidatedForm } from "~/form/ValidatedForm";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Field } from "~/form/Field";
import { FieldError, FieldLabel, TextField } from "~/form/fields";
import {
  CreateTransactionItemSchema,
  createTransactionItemSchema,
  TransactionItemType,
} from "~/api/Transaction/transactionApi.contracts";
import { SubmitButton } from "~/form/SubmitButton";
import { HiddenField } from "~/form/fields/HiddenField";
import { NumberField } from "~/form/fields/NumberField";

interface TransactionItemFormProps {
  onSubmit?: (values: CreateTransactionItemSchema) => void;
}

export const TransactionItemForm: React.FC<TransactionItemFormProps> = ({
  onSubmit,
}) => {
  const [form] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createTransactionItemSchema });
    },
    shouldValidate: "onSubmit",
    onSubmit: (e, { formData }) => {
      e.preventDefault();
      e.stopPropagation();

      const values: Record<string, unknown> = {};

      for (let [key, value] of formData.entries()) {
        values[key] = value;
      }

      onSubmit?.(values as CreateTransactionItemSchema);
    },
  });

  return (
    <ValidatedForm method="POST" form={form}>
      <HiddenField name="type" defaultValue={TransactionItemType.OUTCOME} />

      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <TextField placeholder="eg. Shopping mall" />
        <FieldError />
      </Field>

      <Field name="category">
        <FieldLabel>Category</FieldLabel>
        <TextField placeholder="eg. Diary" />
        <FieldError />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field name="value">
          <FieldLabel>Price</FieldLabel>
          <NumberField placeholder="eg. 2.22" />
          <FieldError />
        </Field>

        <Field name="amount">
          <FieldLabel>Amount</FieldLabel>
          <NumberField placeholder="eg. 1" />
          <FieldError />
        </Field>
      </div>

      <SubmitButton>Add item</SubmitButton>
    </ValidatedForm>
  );
};
