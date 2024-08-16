import React from 'react';
import { Check } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const CheckIcon: React.FC<IconProps> = (props) => {
  return <Check {...props} />;
};
