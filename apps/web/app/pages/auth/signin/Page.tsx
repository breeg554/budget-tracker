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
import { GlobalError } from '~/form/GlobalError';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { AuthWrapper } from '~/pages/auth/components/AuthWrapper';
import { FormWrapper } from '~/pages/auth/components/FormWrapper';
import { routes } from '~/routes';
import { action } from '~/routes/signIn';

import { schema } from './schema';

export const SignInPage = () => {
  const lastResult = useActionData<typeof action>();
  const [form] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onSubmit',
  });

  return (
    <AuthWrapper>
      <h1 className="text-3xl font-semibold mb-2">Sign in to account</h1>
      <p className="mb-8 text-sm text-center">
        Don't have an account?{' '}
        <Link to={routes.signUp.getPath()} className="font-bold">
          Sign up
        </Link>{' '}
        for an account now.
      </p>

      <FormWrapper>
        <ValidatedForm method="post" form={form} className="w-full">
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

          <GlobalError />

          <SubmitButton className="mt-4 w-full">Sign in</SubmitButton>
        </ValidatedForm>
      </FormWrapper>
    </AuthWrapper>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'SignIn' }];
};
