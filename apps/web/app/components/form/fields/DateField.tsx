import React from "react";
import { getInputProps } from "@conform-to/react";
import { EmailInputProps } from "~/components/inputs/EmailInput";
import { useField } from "../Field";
import { DateInput } from "~/inputs/DateInput";

export const DateField: React.FC<EmailInputProps> = (props) => {
  const field = useField<string>();

  return (
    <DateInput
      {...getInputProps(field, { type: "date" })}
      id={field.name}
      {...props}
    />
  );
};
