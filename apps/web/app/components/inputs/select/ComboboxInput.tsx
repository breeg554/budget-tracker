import React, { ReactNode, useMemo, useState } from 'react';
import { useBoolean, useMediaQuery } from 'usehooks-ts';

import { Button, ButtonProps } from '~/buttons/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { CheckIcon } from '~/icons/CheckIcon';
import { ChevronsUpDownIcon } from '~/icons/ChevronsUpDownIcon';
import { SelectOption } from '~/inputs/select/select.types';
import { Drawer, DrawerContent, DrawerTrigger } from '~/ui/drawer';
import { cn } from '~/utils/cn';

export interface ComboboxInputProps<T> {
  options: SelectOption<T>[];
  placeholder?: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ComboboxInput = <T,>({
  options,
  placeholder = 'Select...',
  defaultValue,
  ...rest
}: ComboboxInputProps<T>) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { value: open, setValue: setOpen } = useBoolean(false);
  const [value, setValue] = useState(defaultValue ?? '');

  const finalValue = rest.value ?? value;
  const finalOnValueChange = rest.onValueChange ?? setValue;
  const finalOpen = rest.open ?? open;
  const finalOnOpenChange = rest.onOpenChange ?? setOpen;

  const onSelect = (currentValue: string) => {
    finalOnValueChange(currentValue === finalValue ? '' : currentValue);
    finalOnOpenChange(false);
  };

  const currentOption = useMemo(() => {
    return options.find((option) => option.value === finalValue);
  }, [finalValue]);

  const currentLabel = currentOption ? currentOption.label : placeholder;

  if (!isDesktop) {
    return (
      <Drawer open={finalOpen} onOpenChange={finalOnOpenChange}>
        <DrawerTrigger asChild>
          <ComboboxTrigger option={currentOption} open={finalOpen}>
            {currentLabel}
          </ComboboxTrigger>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionsList
              value={finalValue}
              options={options}
              onSelect={onSelect}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={finalOpen} onOpenChange={finalOnOpenChange}>
      <PopoverTrigger asChild>
        <ComboboxTrigger option={currentOption} open={finalOpen}>
          {currentLabel}
        </ComboboxTrigger>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <OptionsList value={finalValue} options={options} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
};

interface ComboboxTriggerProps {
  option: SelectOption | undefined;
  open: boolean;
}

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxTriggerProps & ButtonProps
>(({ option, open, children, className, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        'justify-between font-normal',
        {
          'text-muted-foreground': !option,
        },
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
});

interface OptionsListProps<T> {
  options: ComboboxInputProps<T>['options'];
  value: string;
  onSelect: (value: string) => void;
}

function OptionsList<T>({ value, options, onSelect }: OptionsListProps<T>) {
  return (
    <Command
      filter={(value, search) => {
        const option = findOption(options, value);

        if (!option) return 0;

        return option.label.toLowerCase().includes(search.toLowerCase())
          ? 1
          : 0;
      }}
    >
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={onSelect}
            >
              <CheckIcon
                className={cn(
                  'mr-2 h-4 w-4',
                  value === option.value ? 'opacity-100' : 'opacity-0',
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function findOption(options: SelectOption[], value: string) {
  return options.find((option) => option.value === value);
}
