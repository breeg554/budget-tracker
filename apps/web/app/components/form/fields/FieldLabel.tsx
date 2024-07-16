import React from 'react';

import { Label, LabelProps } from '~/components/inputs/Label';
import { cn } from '~/utils/cn';

import { useField } from '../Field';

export const FieldLabel: React.FC<LabelProps> = ({
  children,
  className,
  ...rest
}) => {
  const field = useField();

  return (
    <Label className={cn('mb-1', className)} htmlFor={field.name} {...rest}>
      {children}
    </Label>
  );
};
