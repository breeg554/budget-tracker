import React from "react";
import { ErrorMessage } from "~/components/inputs/ErrorMessage";
import { useField } from "../Field";

export const FieldError = () => {
  const field = useField();

  return <ErrorMessage>{field.errors}</ErrorMessage>;
};
