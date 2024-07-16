import React, { LabelHTMLAttributes } from 'react';

import { cn } from '~/utils/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <label className={cn('text-xs', className)} {...rest}>
      {children}
    </label>
  );
};
