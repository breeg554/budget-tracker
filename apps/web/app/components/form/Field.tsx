import React, { PropsWithChildren } from "react";
import { useField as useConformField } from "@conform-to/react";

type FieldContextProps = {
  name: string;
};

const FieldContext = React.createContext<FieldContextProps | undefined>(
  undefined
);

interface FieldProps {
  name: string;
}

export const Field = ({ name, children }: PropsWithChildren<FieldProps>) => {
  return (
    <FieldContext.Provider value={{ name }}>{children}</FieldContext.Provider>
  );
};

export const useField = <T,>() => {
  const ctx = React.useContext(FieldContext);

  if (!ctx) throw new Error("useField can be used only inside Field");

  const [fieldMeta] = useConformField<T>(ctx.name);

  return fieldMeta;
};
