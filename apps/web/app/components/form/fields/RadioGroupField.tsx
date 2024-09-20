import React from 'react';
import { useInputControl } from '@conform-to/react';

import { useField } from '~/form/Field';
import {
  RadioGroupInput,
  RadioGroupInputItem,
  RadioGroupInputItemCategory,
  RadioGroupInputProps,
} from '~/inputs/RadioGroupInput';

export const RadioGroupField = ({ ...props }: RadioGroupInputProps) => {
  const field = useField<string>();
  const fieldControl = useInputControl(field);

  return (
    <RadioGroupInput
      value={fieldControl.value}
      defaultValue={fieldControl.value}
      onValueChange={(value) => fieldControl.change(value)}
      {...props}
    />
  );
};

export const RadioGroupFieldItem = RadioGroupInputItem;

export const RadioGroupFieldItemCategory = RadioGroupInputItemCategory;
