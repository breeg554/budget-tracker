import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/ui/select';

import { SelectOption } from './select.types';

export interface SelectInputProps extends React.ComponentProps<typeof Select> {
  options: SelectOption[];
  contentProps?: Partial<React.ComponentProps<typeof SelectContent>>;
  triggerProps?: Partial<React.ComponentProps<typeof SelectValue>>;
}
export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  defaultValue,
  contentProps,
  triggerProps,
  ...rest
}) => {
  return (
    <Select value={value} defaultValue={defaultValue} {...rest}>
      <SelectTrigger>
        <SelectValue {...triggerProps} />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
