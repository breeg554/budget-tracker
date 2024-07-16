import type { MetaFunction } from '@remix-run/node';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { createOrganizationSchema } from '~/api/Organization/organizationApi.contracts';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { SubmitButton } from '~/form/SubmitButton';
import { ValidatedForm } from '~/form/ValidatedForm';

export const OrganizationNew = () => {
  const [form] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createOrganizationSchema });
    },
    shouldValidate: 'onSubmit',
  });

  return (
    <div>
      <h1 className="text-xl text-pink-500 mb-10">New organization</h1>

      <ValidatedForm method="post" form={form}>
        <Field name="name">
          <FieldLabel>Name</FieldLabel>
          <TextField />
          <FieldError />
        </Field>

        <SubmitButton>Sign in</SubmitButton>
      </ValidatedForm>
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'New Organizations' }];
};
