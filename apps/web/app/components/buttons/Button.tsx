import React, { ButtonHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn(
        "text-white bg-pink-500 disabled:bg-neutral-200",
        className
      )}
      {...rest}
    >
      {children}
      {loading && <span>loading...</span>}
    </button>
  );
};
