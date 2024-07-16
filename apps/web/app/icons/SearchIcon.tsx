import React from 'react';
import { Search } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const SearchIcon: React.FC<IconProps> = (props) => {
  return <Search {...props} />;
};
