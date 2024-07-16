import React from 'react';
import { FileText } from 'lucide-react';

import { IconProps } from '~/icons/icon.types';

export const FileTextIcon: React.FC<IconProps> = (props) => {
  return <FileText {...props} />;
};
