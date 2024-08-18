import React from 'react';

import { cn } from '~/utils/cn';

export const PageBackground = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'absolute z-0 left-0 right-0 top-0 bg-green-950 w-full h-[300px] rounded-b-2xl',
        className,
      )}
      {...rest}
    />
  );
};
