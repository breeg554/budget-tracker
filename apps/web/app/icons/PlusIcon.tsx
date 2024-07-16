import React from 'react';
import { Plus } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const PlusIcon: React.FC<IconProps> = (props) => {
  return <Plus {...props} />;
};
