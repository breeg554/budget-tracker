import React from 'react';
import { getInputProps } from '@conform-to/react';

import { EmailInput, EmailInputProps } from '~/components/inputs/EmailInput';

import { useField } from '../Field';

export const EmailField: React.FC<EmailInputProps> = (props) => {
  const field = useField<string>();

  return (
    <EmailInput
      {...getInputProps(field, { type: 'email' })}
      id={field.name}
      {...props}
    />
  );
};
