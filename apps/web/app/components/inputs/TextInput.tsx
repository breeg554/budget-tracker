import { TextField } from "@radix-ui/themes";
import React, { InputHTMLAttributes } from "react";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "value" | "size" | "type" | "color"
> & {
  variant?: "classic" | "surface" | "soft";
  value?: string | number;
  defaultValue?: string | number;
  size?: "1" | "2" | "3";
  type?:
    | "date"
    | "datetime-local"
    | "email"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | "color"
    | "checkbox"
    | "radio"
    | "file"
    | "range";
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type, ...props }, ref) => {
    if (
      type === "color" ||
      type === "checkbox" ||
      type === "radio" ||
      type === "file" ||
      type === "range"
    ) {
      throw new Error("Unsupported input type");
    }

    return <TextField.Root type={type} ref={ref} {...props} />;
  },
);
