import React from "react";
import {
  IconButton as RadixIconButton,
  IconButtonProps as RadixIconButtonProps,
} from "@radix-ui/themes";

export type IconButtonProps = RadixIconButtonProps & {};

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return <RadixIconButton {...props} />;
};
