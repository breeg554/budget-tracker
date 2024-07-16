import React from 'react';
import { ScanBarcode } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const BarcodeIcon: React.FC<IconProps> = (props) => {
  return <ScanBarcode {...props} />;
};
