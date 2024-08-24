import React from 'react';
import { FilterIcon } from 'lucide-react';

import { IconButton } from '~/buttons/IconButton';
import { TextInput } from '~/inputs/TextInput';

interface ReceiptsFilterProps {
  onFilter: (params: Record<string, string | number>) => void;
}

export const ReceiptsFilter = ({ onFilter }: ReceiptsFilterProps) => {
  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter({ search: e.target.value });
  };

  return (
    <div className="flex justify-between items-center gap-1">
      <TextInput placeholder="Search..." onBlur={onBlur} />
      <IconButton icon={<FilterIcon />} variant="secondary" />
    </div>
  );
};
