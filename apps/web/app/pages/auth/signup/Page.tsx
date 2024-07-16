import type { MetaFunction } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Field } from '~/components/form/Field';
import {
  EmailField,
  FieldError,
  FieldLabel,
  PasswordField,
} from '~/components/form/fields';
import { SubmitButton } from '~/components/form/SubmitButton';
import { ValidatedForm } from '~/components/form/ValidatedForm';
import { schema } from '~/pages/auth/signin/schema';
import { routes } from '~/routes';

import { action } from './action.server';

export const SignUpPage = () => {
  const lastResult = useActionData<typeof action>();

  const [form] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onSubmit',
  });

  return (
    <div>
      <h1 className="text-xl text-pink-500 mb-10">Register</h1>

      <ValidatedForm method="post" form={form}>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <EmailField />
          <FieldError />
        </Field>

        <Field name="password">
          <FieldLabel>Password</FieldLabel>
          <PasswordField />
          <FieldError />
        </Field>

        <SubmitButton>Sign up</SubmitButton>

        <p>
          Already has an account?{' '}
          <Link to={routes.signIn.getPath()}>Go to sign in</Link>
        </p>
      </ValidatedForm>
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'SignUp' }];
};
