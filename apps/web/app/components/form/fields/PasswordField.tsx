import React from 'react';
import { getInputProps } from '@conform-to/react';

import {
  PasswordInput,
  PasswordInputProps,
} from '~/components/inputs/PasswordInput';

import { useField } from '../Field';

export const PasswordField: React.FC<PasswordInputProps> = (props) => {
  const field = useField<string>();

  return (
    <PasswordInput
      {...getInputProps(field, { type: 'password' })}
      id={field.name}
      {...props}
    />
  );
};
