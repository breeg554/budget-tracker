import React from "react";
import { getSelectProps, useInputControl } from "@conform-to/react";
import { useField } from "../Field";
import { SelectInput, SelectInputProps } from "~/inputs/SelectInput";

export const SelectField: React.FC<SelectInputProps> = (props) => {
  const field = useField<string>();
  const fieldControl = useInputControl(field);

  return (
    //@ts-ignore
    <SelectInput
      {...getSelectProps(field)}
      value={fieldControl.value}
      onValueChange={(value) => fieldControl.change(value)}
      {...props}
    />
  );
};
