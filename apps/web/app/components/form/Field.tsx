import React, { PropsWithChildren } from "react";
import { useField as useConformField } from "@conform-to/react";
import { cn } from "~/utils/cn";

type FieldContextProps = {
  name: string;
  formId?: string;
};

const FieldContext = React.createContext<FieldContextProps | undefined>(
  undefined,
);

interface FieldProps {
  name: string;
  formId?: string;
  className?: string;
}

export const Field = ({
  name,
  children,
  formId,
  className,
}: PropsWithChildren<FieldProps>) => {
  return (
    <FieldContext.Provider value={{ name, formId }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </FieldContext.Provider>
  );
};

export const useField = <T,>() => {
  const ctx = React.useContext(FieldContext);

  if (!ctx) throw new Error("useField can be used only inside Field");

  const [fieldMeta] = useConformField<T>(ctx.name, { formId: ctx.formId });

  return fieldMeta;
};
