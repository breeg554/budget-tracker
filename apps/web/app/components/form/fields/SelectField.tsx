import React from 'react';
import { useInputControl } from '@conform-to/react';

import { SelectInput, SelectInputProps } from '~/inputs/SelectInput';

import { useField } from '../Field';

export const SelectField: React.FC<SelectInputProps> = ({
  triggerProps,
  ...props
}) => {
  const field = useField<string>();
  const fieldControl = useInputControl(field);

  return (
    <SelectInput
      name={field.name}
      value={fieldControl.value}
      defaultValue={fieldControl.value}
      onValueChange={(value) => fieldControl.change(value)}
      triggerProps={{
        ...triggerProps,
        onBlur: fieldControl.blur,
        onFocus: fieldControl.focus,
      }}
      {...props}
    />
  );
};
