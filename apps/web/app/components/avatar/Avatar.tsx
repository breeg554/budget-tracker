import React, { ComponentProps, ReactNode } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import {
  Avatar as UIAvatar,
  AvatarFallback as UIAvatarFallback,
  AvatarImage as UIAvatarImage,
} from '~/ui/avatar';
import { cn } from '~/utils/cn';

export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'lg';

type BaseAvatarProps = ComponentProps<typeof UIAvatar> & { size?: AvatarSize };

type ImageAvatarProps = Omit<BaseAvatarProps, 'content' | 'children'> & {
  src: string;
  fallback?: ReactNode;
};

type TextAvatarProps = BaseAvatarProps & {
  content: ReactNode;
};

export type AvatarProps = ImageAvatarProps | TextAvatarProps;

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => {
  if ('src' in props) {
    const { src, fallback, ...rest } = props;
    return (
      <UIAvatar ref={ref} className={cn(getSize(size), className)} {...rest}>
        <UIAvatarImage src={src} />
        <UIAvatarFallback className={cn(getContentSize(size))}>
          {fallback}
        </UIAvatarFallback>
      </UIAvatar>
    );
  }

  return (
    <UIAvatar ref={ref} className={cn(getSize(size), className)} {...props}>
      <UIAvatarFallback className={cn(getContentSize(size))}>
        {props.content}
      </UIAvatarFallback>
    </UIAvatar>
  );
});

function getSize(size?: AvatarSize) {
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

function getContentSize(size?: AvatarSize) {
  switch (size) {
    case 'xxs':
      return 'text-xs';
    case 'xs':
      return 'text-xs';
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-sm';
  }
}
