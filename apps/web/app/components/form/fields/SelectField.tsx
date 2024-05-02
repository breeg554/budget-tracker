import React from "react";
import { getSelectProps } from "@conform-to/react";
import { useField } from "../Field";
import { SelectInput, SelectInputProps } from "~/inputs/SelectInput";

export const SelectField: React.FC<SelectInputProps> = (props) => {
  const field = useField<string>();

  //@ts-ignore
  return <SelectInput {...getSelectProps(field)} {...props} />;
};
