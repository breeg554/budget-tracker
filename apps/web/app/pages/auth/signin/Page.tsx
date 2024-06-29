import type { MetaFunction } from "@remix-run/node";
import { schema } from "./schema";
import { ValidatedForm } from "~/components/form/ValidatedForm";
import { SubmitButton } from "~/components/form/SubmitButton";
import { Field } from "~/components/form/Field";
import {
  EmailField,
  FieldError,
  PasswordField,
  FieldLabel,
} from "~/components/form/fields";
import { Link, useActionData } from "@remix-run/react";
import { routes } from "~/routes";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { action } from "~/routes/signIn";
import { GlobalError } from "~/form/GlobalError";

export const SignInPage = () => {
  const lastResult = useActionData<typeof action>();
  const [form] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <div>
      <h1 className="text-xl text-pink-500 mb-10">Login</h1>

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

        <GlobalError />

        <SubmitButton>Sign in</SubmitButton>

        <p>
          First time in PDG?{" "}
          <Link to={routes.signUp.getPath()}>Go to sign up</Link>
        </p>
      </ValidatedForm>
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "SignIn" }];
};
