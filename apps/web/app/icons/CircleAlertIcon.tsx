import React from 'react';
import { CircleAlert } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const CircleAlertIcon: React.FC<IconProps> = (props) => {
  return <CircleAlert {...props} />;
};
