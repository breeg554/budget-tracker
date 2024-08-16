import React from 'react';
import { useInputControl } from '@conform-to/react';

import {
  ComboboxInput,
  ComboboxInputProps,
} from '~/inputs/select/ComboboxInput';

import { useField } from '../Field';

export const ComboboxField = <T,>({ ...props }: ComboboxInputProps<T>) => {
  const field = useField<string>();
  const fieldControl = useInputControl(field);

  return (
    <ComboboxInput
      value={fieldControl.value}
      defaultValue={fieldControl.value}
      onValueChange={(value) => fieldControl.change(value)}
      {...props}
    />
  );
};
