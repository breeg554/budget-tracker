import React from "react";
import { TextInput, TextInputProps } from "./TextInput";

export type NumberInputProps = Omit<TextInputProps, "type">;

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    return <TextInput ref={ref} type="number" {...props} />;
  },
);
