import React from 'react';
import { getInputProps, useInputControl } from '@conform-to/react';

import { DateInput, DateInputProps } from '~/inputs/DateInput';
import { CustomDate } from '~/utils/CustomDate';

import { useField } from '../Field';

export const DateField: React.FC<DateInputProps> = (props) => {
  const field = useField<string>();
  const fieldProps = getInputProps(field, { type: 'date' });
  const fieldControl = useInputControl(field);

  return (
    <DateInput
      selected={field.value ? new Date(field.value) : undefined}
      onSelect={(date) => {
        const newDate = date
          ? new CustomDate(date).setHours(12).formatISO()
          : '';

        return fieldControl.change(newDate);
      }}
      {...fieldProps}
      id={field.name}
      {...props}
    />
  );
};
