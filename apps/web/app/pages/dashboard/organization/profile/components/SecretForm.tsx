import React from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { createSecretSchema } from '~/api/Organization/organizationApi.contracts';
import { Field } from '~/form/Field';
import { FieldError, FieldLabel, TextField } from '~/form/fields';
import { HiddenField } from '~/form/fields/HiddenField';
import { SubmitButton } from '~/form/SubmitButton';
import { ValidatedForm } from '~/form/ValidatedForm';

interface SecretFormProps {}

export const SecretForm: React.FC<SecretFormProps> = () => {
  const [form] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSecretSchema });
    },
    shouldValidate: 'onSubmit',
  });

  return (
    <ValidatedForm method="post" form={form}>
      <HiddenField name="name" value="openai" />

      <Field name="value">
        <FieldLabel>Value</FieldLabel>
        <TextField />
        <FieldError />
      </Field>

      <SubmitButton>Create</SubmitButton>
    </ValidatedForm>
  );
};
