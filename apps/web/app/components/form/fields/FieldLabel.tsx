import React from "react";
import { Label, LabelProps } from "~/components/inputs/Label";
import { useField } from "../Field";

export const FieldLabel: React.FC<LabelProps> = ({ children, ...rest }) => {
  const field = useField();

  return (
    <Label htmlFor={field.name} {...rest}>
      {children}
    </Label>
  );
};
