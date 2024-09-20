import React from 'react';

import { cn } from '~/utils/cn';

export function DescriptionRow({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('grid grid-cols-[1fr_3fr] py-1.5 items-center', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function DescriptionRowContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <p
      className={cn('text-foreground line-clamp-1 text-sm', className)}
      {...rest}
    >
      {children}
    </p>
  );
}

export function DescriptionRowName({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'text-muted-foreground text-sm shrink-0 text-xs',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
