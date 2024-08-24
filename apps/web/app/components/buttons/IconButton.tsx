import React, { isValidElement, ReactElement, ReactNode } from 'react';

import { Button, ButtonProps } from '~/buttons/Button';
import { cn } from '~/utils/cn';

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    const clonedIcon = isValidElement(icon)
      ? React.cloneElement(icon, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          className: cn(
            getIconSize(props.size),
            (icon as ReactElement).props.className,
          ),
        })
      : icon;

    return (
      <Button
        ref={ref}
        size="icon"
        className={cn('p-0 shrink-0', getButtonSize(props.size), className)}
        {...props}
      >
        {clonedIcon}
      </Button>
    );
  },
);

function getButtonSize(size?: string | null) {
  switch (size) {
    case 'xxs':
      return 'h-6 w-6';
    case 'xs':
      return 'h-7 w-7';
    case 'sm':
      return 'h-9 w-9';
    case 'lg':
      return 'h-11 w-11';
    default:
      return 'h-10 w-10';
  }
}

export function getIconSize(size?: string | null) {
  switch (size) {
    case 'xxs':
      return 'h-3.5 w-3.5';
    case 'xs':
      return 'h-4 w-4';
    case 'sm':
      return 'h-5 w-5';
    case 'lg':
      return 'h-6 w-6';
    default:
      return 'h-5 w-5';
  }
}
