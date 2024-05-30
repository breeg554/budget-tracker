import React from "react";
import {
  Button as RadixButton,
  ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import { cn } from "~/utils/cn";

export type ButtonProps = RadixButtonProps & {};

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <RadixButton className={cn("cursor-pointer", className)} {...props} />;
};
