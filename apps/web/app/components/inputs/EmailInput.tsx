import React from 'react';

import { TextInput, TextInputProps } from './TextInput';

export type EmailInputProps = Omit<TextInputProps, 'type'>;

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (props, ref) => {
    return <TextInput ref={ref} type="email" {...props} />;
  },
);
