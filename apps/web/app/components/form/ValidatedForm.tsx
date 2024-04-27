import React, { PropsWithChildren } from "react";
import { Schema } from "zod";
import { FormProvider, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, FormProps } from "./Form";

interface ValidatedFormProps extends FormProps {
  schema: Schema;
}

export const ValidatedForm: React.FC<PropsWithChildren<ValidatedFormProps>> = ({
  children,
  schema,
  ...rest
}) => {
  const [form] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <FormProvider context={form.context}>
      <Form {...rest} id={form.id} onSubmit={form.onSubmit}>
        {children}
      </Form>
    </FormProvider>
  );
};
