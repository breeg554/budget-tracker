import type { MetaFunction } from "@remix-run/node";
import { signUpSchema } from "~/api/Auth/authApi.contracts";
import { ValidatedForm } from "~/components/form/ValidatedForm";
import { SubmitButton } from "~/components/form/SubmitButton";
import { Field } from "~/components/form/Field";
import {
  EmailField,
  FieldError,
  PasswordField,
  FieldLabel,
} from "~/components/form/fields";
import { Link } from "@remix-run/react";
import { routes } from "~/routes";

export const SignUpPage = () => {
  return (
    <div>
      <h1 className="text-xl text-pink-500 mb-10">Register</h1>

      <ValidatedForm method="post" schema={signUpSchema}>
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
          Already has an account?{" "}
          <Link to={routes.signIn.getPath()}>Go to sign in</Link>
        </p>
      </ValidatedForm>
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "SignUp" }];
};
