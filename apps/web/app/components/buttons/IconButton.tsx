import React from 'react';

import { Button, ButtonProps } from '~/buttons/Button';
import { cn } from '~/utils/cn';

export type IconButtonProps = ButtonProps & {};

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      size="icon"
      className={cn('cursor-pointer', className)}
      {...props}
    />
  );
};
