import React, { PropsWithChildren } from "react";
import { FormMetadata, FormProvider } from "@conform-to/react";
import { Form, FormProps } from "./Form";

interface ValidatedFormProps extends FormProps {
  form: FormMetadata<any, any>;
}

export const ValidatedForm: React.FC<PropsWithChildren<ValidatedFormProps>> = ({
  children,
  form,
  ...rest
}) => {
  return (
    <FormProvider context={form.context}>
      <Form {...rest} id={form.id} onSubmit={form.onSubmit}>
        {children}
      </Form>
    </FormProvider>
  );
};
