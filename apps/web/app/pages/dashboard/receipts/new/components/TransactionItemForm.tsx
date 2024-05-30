import React from "react";
import { ValidatedForm } from "~/form/ValidatedForm";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Field } from "~/form/Field";
import { FieldError, FieldLabel, TextField } from "~/form/fields";
import {
  createTransactionItemSchema,
  TransactionItemType,
} from "~/api/Transaction/transactionApi.contracts";
import { SubmitButton } from "~/form/SubmitButton";
import { HiddenField } from "~/form/fields/HiddenField";
import { NumberField } from "~/form/fields/NumberField";
import { SelectField } from "~/form/fields/SelectField";
import {
  CreateTransactionItemDto,
  GetTransactionItemCategoryDto,
} from "~/api/Transaction/transactionApi.types";

interface TransactionItemFormProps {
  onSubmit?: (values: CreateTransactionItemDto) => void;
  categories: GetTransactionItemCategoryDto[];
  defaultValues?: Partial<CreateTransactionItemDto>
}

export const TransactionItemForm: React.FC<TransactionItemFormProps> = ({
  onSubmit,
  categories,
  defaultValues
}) => {
  const [form] = useForm({
    defaultValue: defaultValues,
    shouldValidate: "onSubmit",
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
    },
  });

  const categoryValues = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <ValidatedForm form={form} className="flex flex-col gap-3">
      <HiddenField name="type" defaultValue={TransactionItemType.OUTCOME} />

      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <TextField placeholder="eg. Shopping mall" />
        <FieldError />
      </Field>

      <Field name="category">
        <FieldLabel>Category</FieldLabel>
        <SelectField
          options={categoryValues}
          contentProps={{ position: "popper" }}
          triggerProps={{ placeholder: "eg. Dairy" }}
        />
        <FieldError />
      </Field>

      <Field name="amount">
        <FieldLabel>Amount</FieldLabel>
        <NumberField placeholder="Amount of the item" />
        <FieldError />
      </Field>

      <Field name="value">
        <FieldLabel>Price</FieldLabel>
        <NumberField placeholder="Price of the single item" />
        <FieldError />
      </Field>

      <SubmitButton>{defaultValues ?"Update item" :"Add item"}</SubmitButton>
    </ValidatedForm>
  );
};
