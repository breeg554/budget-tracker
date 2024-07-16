import React from 'react';
import { LayoutDashboard } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const DashboardIcon: React.FC<IconProps> = (props) => {
  return <LayoutDashboard {...props} />;
};
