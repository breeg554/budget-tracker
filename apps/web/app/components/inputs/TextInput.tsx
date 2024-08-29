import * as React from 'react';

import { cn } from '~/utils/cn';

export type InputSize = 'sm';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          getInputSize(size),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TextInput.displayName = 'TextInput';

export { TextInput };

export function getInputSize(size?: InputSize) {
  switch (size) {
    case 'sm':
      return 'h-9';
    default:
      return 'h-10';
  }
}
