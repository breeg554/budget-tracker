import React from 'react';

import { cn } from '~/utils/cn';

export const FormWrapper = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section className={cn('max-w-[400px] w-full', className)}>
      {children}
    </section>
  );
};
