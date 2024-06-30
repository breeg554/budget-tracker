import React from "react";
import { getInputProps, useInputControl } from "@conform-to/react";
import { useField } from "../Field";
import { DateInput, DateInputProps } from "~/inputs/DateInput";

export const DateField: React.FC<DateInputProps> = (props) => {
  const field = useField<string>();
  const fieldProps = getInputProps(field, { type: "date" });
  const fieldControl = useInputControl(field);

  return (
    <DateInput
      selected={field.value ? new Date(field.value) : undefined}
      onSelect={(date) => fieldControl.change(date?.toISOString())}
      {...fieldProps}
      id={field.name}
      {...props}
    />
  );
};
