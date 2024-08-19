import React, { ReactNode, useMemo, useState } from 'react';
import { useBoolean } from 'usehooks-ts';

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
import { useBreakpoints } from '~/hooks/useBreakpoints';
import { CheckIcon } from '~/icons/CheckIcon';
import { ChevronsUpDownIcon } from '~/icons/ChevronsUpDownIcon';
import { SelectOption } from '~/inputs/select/select.types';
import { Drawer, DrawerContent, DrawerTrigger } from '~/ui/drawer';
import { cn } from '~/utils/cn';

export interface ComboboxInputProps<T>
  extends Pick<OptionsListProps<T>, 'renderOption'> {
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
  renderOption,
  ...rest
}: ComboboxInputProps<T>) => {
  const { isDesktop } = useBreakpoints();
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
              renderOption={renderOption}
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
        <OptionsList
          value={finalValue}
          options={options}
          onSelect={onSelect}
          renderOption={renderOption}
        />
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
  renderOption?: (option: SelectOption<T>, isSelected: boolean) => ReactNode;
}

function OptionsList<T>({
  value,
  options,
  onSelect,
  renderOption,
}: OptionsListProps<T>) {
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
              {renderOption ? (
                renderOption(option, option.value === value)
              ) : (
                <ComboboxOption
                  value={option.value}
                  label={option.label}
                  isSelected={option.value === value}
                />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export type ComboboxOptionProps<T> = SelectOption<T> & {
  isSelected: boolean;
};

export function ComboboxOption<T>({
  label,
  isSelected,
}: ComboboxOptionProps<T>) {
  return (
    <>
      <CheckIcon
        className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {label}
    </>
  );
}

function findOption(options: SelectOption[], value: string) {
  return options.find((option) => option.value === value);
}
