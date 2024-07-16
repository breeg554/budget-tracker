import React, { PropsWithChildren } from 'react';
import { FormMetadata, FormProvider, getFormProps } from '@conform-to/react';

import { Form, FormProps } from './Form';

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
      <Form {...getFormProps(form)} {...rest}>
        {children}
      </Form>
    </FormProvider>
  );
};
