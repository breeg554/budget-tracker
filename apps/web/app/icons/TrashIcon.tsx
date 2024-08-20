import React from 'react';
import { Trash } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const TrashIcon: React.FC<IconProps> = (props) => {
  return <Trash {...props} />;
};
