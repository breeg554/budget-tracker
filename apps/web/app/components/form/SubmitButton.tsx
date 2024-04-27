import React from "react";
import { Button, ButtonProps } from "~/components/buttons/Button";
import { useNavigation } from "@remix-run/react";

export const SubmitButton: React.FC<ButtonProps> = ({
  children,
  disabled: propsDisabled,
  loading: propsLoading,
  ...rest
}) => {
  const { state } = useNavigation();
  const isIdle = state === "idle";

  const loading = propsLoading ?? !isIdle;
  const disabled = propsDisabled ?? !isIdle;

  return (
    <Button loading={loading} disabled={disabled} {...rest}>
      {children}
    </Button>
  );
};
