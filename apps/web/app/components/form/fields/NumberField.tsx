import React from "react";
import { getInputProps } from "@conform-to/react";
import { useField } from "../Field";
import { NumberInput, NumberInputProps } from "~/inputs/NumberInput";

export const NumberField: React.FC<NumberInputProps> = (props) => {
  const field = useField<number>();

  return (
    <NumberInput
      {...getInputProps(field, { type: "number" })}
      id={field.name}
      {...props}
    />
  );
};
