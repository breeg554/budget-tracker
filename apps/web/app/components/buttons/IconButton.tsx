import React from "react";

import { cn } from "~/utils/cn";
import { Button, ButtonProps } from "~/buttons/Button";

export type IconButtonProps = ButtonProps & {};

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      size="icon"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  );
};
