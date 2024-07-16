import React from "react";
import { ErrorMessage } from "~/components/inputs/ErrorMessage";
import { useField } from "../Field";

export const FieldError = () => {
  const field = useField();

  return <ErrorMessage className="mt-1">{field.errors}</ErrorMessage>;
};
