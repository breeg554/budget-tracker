import React from "react";
import {
  IconButton as RadixIconButton,
  IconButtonProps as RadixIconButtonProps,
} from "@radix-ui/themes";
import { cn } from "~/utils/cn";

export type IconButtonProps = RadixIconButtonProps & {};

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <RadixIconButton className={cn("cursor-pointer", className)} {...props} />
  );
};
