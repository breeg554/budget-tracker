import React from 'react';
import { TriangleAlert } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const TriangleAlertIcon: React.FC<IconProps> = (props) => {
  return <TriangleAlert {...props} />;
};
