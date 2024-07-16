import React, { PropsWithChildren } from "react";
import { cn } from "~/utils/cn";

export const ErrorMessage: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <div className={cn("text-red-500 text-xs", className)}>{children}</div>
  );
};
