import React, { PropsWithChildren } from "react";
import {
  Form as RemixForm,
  FormProps as RemixFormProps,
} from "@remix-run/react";

export type FormProps = PropsWithChildren<RemixFormProps>;

export const Form: React.FC<FormProps> = ({ children, ...rest }) => {
  return (
    <RemixForm noValidate {...rest}>
      {children}
    </RemixForm>
  );
};
