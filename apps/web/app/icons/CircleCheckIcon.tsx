import React from 'react';
import { CircleCheck } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const CircleCheckIcon: React.FC<IconProps> = (props) => {
  return <CircleCheck {...props} />;
};
