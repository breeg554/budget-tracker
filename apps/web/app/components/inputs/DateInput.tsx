import React from "react";
import { TextInput, TextInputProps } from "./TextInput";

export type DateInputProps = Omit<TextInputProps, "type">;

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (props, ref) => {
    return <TextInput ref={ref} type="date" {...props} />;
  },
);
