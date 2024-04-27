import React, { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ children, ...rest }) => {
  return (
    <label className="text-xs" {...rest}>
      {children}
    </label>
  );
};
