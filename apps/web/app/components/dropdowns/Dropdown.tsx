import React, { isValidElement, ReactElement, ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { Button, ButtonProps } from '~/buttons/Button';
import { getIconSize, IconButton, IconButtonProps } from '~/buttons/IconButton';
import { EllipsisVerticalIcon } from '~/icons/EllipsisVerticalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu';
import { cn } from '~/utils/cn';

const Dropdown = DropdownMenu;

const DropdownContent = DropdownMenuContent;

const DropdownTrigger = (props: Partial<IconButtonProps>) => {
  return (
    <DropdownMenuTrigger asChild>
      <IconButton
        icon={<EllipsisVerticalIcon />}
        variant="ghost"
        size="xs"
        {...props}
      />
    </DropdownMenuTrigger>
  );
};

DropdownTrigger.displayName = 'DropdownTrigger';

type DropdownItemProps = ButtonProps & {
  icon?: ReactNode;
};

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(
  (
    { className, children, icon, size = 'xs', variant = 'ghost', ...rest },
    ref,
  ) => {
    const clonedIcon = isValidElement(icon)
      ? React.cloneElement(icon, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          className: cn(
            getIconSize(size),
            (icon as ReactElement).props.className,
          ),
        })
      : icon;

    return (
      <DropdownMenuItem asChild>
        <Button
          variant={variant === 'destructive' ? 'ghost' : variant}
          size={size}
          className={cn(
            'w-full justify-start font-normal text-foreground gap-1',
            {
              'text-red-500': variant === 'destructive',
            },
            className,
          )}
          {...rest}
        >
          {clonedIcon}
          {children}
        </Button>
      </DropdownMenuItem>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem };
