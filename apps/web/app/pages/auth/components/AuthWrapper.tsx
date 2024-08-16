import React from 'react';

import { cn } from '~/utils/cn';

export const AuthWrapper = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <main
      className={cn(
        'w-full h-screen flex flex-col justify-center items-center overflow-y-auto p-6',
        className,
      )}
    >
      {children}
    </main>
  );
};
