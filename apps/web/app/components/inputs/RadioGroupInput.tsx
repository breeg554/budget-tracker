import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { GetTransactionItemCategoryDto } from '~/api/Transaction/transactionApi.types';
import { Label } from '~/inputs/Label';
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemProps,
  RadioGroupProps,
} from '~/ui/radio-group';
import { cn } from '~/utils/cn';

export type RadioGroupInputProps = RadioGroupProps;

export const RadioGroupInput = React.forwardRef<
  HTMLInputElement,
  RadioGroupInputProps
>((props, ref) => {
  return <RadioGroup ref={ref} {...props} />;
});

export type RadioGroupInputItemProps = RadioGroupItemProps;

export const RadioGroupInputItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupInputItemProps
>((props, ref) => {
  return <RadioGroupItem ref={ref} {...props} />;
});

export type RadioGroupInputItemCategoryProps = Omit<
  RadioGroupInputItemProps,
  'value' | 'children'
> & {
  category: GetTransactionItemCategoryDto;
};

export const RadioGroupInputItemCategory = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupInputItemCategoryProps
>(({ category, className, ...rest }, ref) => {
  return (
    <Label
      className={cn(
        'w-fit cursor-pointer flex gap-1 items-center relative pl-1 pr-2 rounded-full border border-input text-sm has-[button[data-state=checked]]:bg-accent-foreground has-[button[data-state=checked]]:text-white has-[button[data-state=checked]]:border-accent-foreground',
        className,
      )}
    >
      <RadioGroupItem
        ref={ref}
        className="opacity-0 absolute pointer-events-none"
        {...rest}
        value={category.id}
      />
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </Label>
  );
});
