import React from "react";
import { TextInput, TextInputProps } from "./TextInput";

export type PasswordInputProps = Omit<TextInputProps, "type">;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>((props, ref) => {
  return <TextInput ref={ref} type="password" {...props} />;
});
