import React from 'react';
import { RotateCcw } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const ReloadIcon: React.FC<IconProps> = (props) => {
  return <RotateCcw {...props} />;
};
