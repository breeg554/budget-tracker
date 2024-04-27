import React, { PropsWithChildren } from "react";

export const ErrorMessage: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-red-500 text-xs">{children}</div>;
};
