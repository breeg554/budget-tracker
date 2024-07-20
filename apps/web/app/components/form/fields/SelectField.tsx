import React from 'react';
import { useInputControl } from '@conform-to/react';

import { SelectInput, SelectInputProps } from '~/inputs/SelectInput';

import { useField } from '../Field';

export const SelectField: React.FC<SelectInputProps> = (props) => {
  const field = useField<string>();
  const fieldControl = useInputControl(field);
  return (
    <SelectInput
      value={fieldControl.value}
      defaultValue={fieldControl.value}
      onValueChange={(value) => fieldControl.change(value)}
      {...props}
    />
  );
};
