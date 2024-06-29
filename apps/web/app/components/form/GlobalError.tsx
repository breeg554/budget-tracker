import React from "react";
import { Field } from "./Field";
import { FieldError } from "~/form/fields";

export const GlobalError = () => {
  return (
    <Field name="global">
      <FieldError />
    </Field>
  );
};
