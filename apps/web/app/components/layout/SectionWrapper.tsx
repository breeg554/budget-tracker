import React, { PropsWithChildren } from 'react';

import { cn } from '~/utils/cn';

export const SectionWrapper: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <section className={cn('relative px-4', className)}>{children}</section>
  );
};
