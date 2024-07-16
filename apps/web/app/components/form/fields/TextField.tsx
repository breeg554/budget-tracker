import React from 'react';
import { getInputProps } from '@conform-to/react';

import { TextInput, TextInputProps } from '~/components/inputs/TextInput';

import { useField } from '../Field';

export const TextField: React.FC<TextInputProps> = (props) => {
  const field = useField();

  return (
    <TextInput
      {...getInputProps(field, { type: 'text' })}
      id={field.name}
      {...props}
    />
  );
};
