import React from "react";
import {
  Button as RadixButton,
  ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";

export type ButtonProps = RadixButtonProps & {};

export const Button: React.FC<ButtonProps> = (props) => {
  return <RadixButton {...props} />;
};
