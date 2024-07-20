import React from 'react';

import { SelectInput, SelectOption } from '~/inputs/SelectInput';

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
