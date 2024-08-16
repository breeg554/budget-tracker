import React from 'react';

import { SelectOption } from '~/inputs/select/select.types';
import { SelectInput } from '~/inputs/select/SelectInput';

interface OrganizationSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export const OrganizationSelect: React.FC<OrganizationSelectProps> = ({
  options,
  value,
  onValueChange,
}) => {
  return (
    <SelectInput
      options={options}
      value={value}
      onValueChange={onValueChange}
    />
  );
};
