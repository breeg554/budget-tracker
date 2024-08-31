import React from 'react';
import {
  DayPickerRangeProps,
  DayPickerSingleProps,
  DateRange as ODateRange,
} from 'react-day-picker';
import { format } from 'date-fns';

import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import { CalendarIcon } from '~/icons/CalendarIcon';
import { CrossIcon } from '~/icons/CrossIcon';
import { Calendar } from '~/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/ui/popover';
import { cn } from '~/utils/cn';

export type DateInputProps = Omit<DayPickerSingleProps, 'mode'>;

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (props) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !props.selected && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {props.selected ? (
              format(props.selected, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" {...props} />
        </PopoverContent>
      </Popover>
    );
  },
);

export type DateRangeInputProps = Omit<DayPickerRangeProps, 'mode'> & {
  onClear?: () => void;
};

export type DateRange = ODateRange;

export const DateRangeInput = React.forwardRef<
  HTMLInputElement,
  DateRangeInputProps
>(({ onClear, ...props }) => {
  const date = props.selected;

  const clear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClear?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            'relative justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} -{' '}
                {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date</span>
          )}

          {date && onClear ? (
            <IconButton
              icon={
                <div>
                  <CrossIcon className="w-3.5 h-3.5" />
                </div>
              }
              onClick={clear}
              tabIndex={1}
              className="absolute top-1/2 right-2 -translate-y-1/2"
              variant="ghost"
              size="xxs"
              asChild
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" numberOfMonths={2} {...props} />
      </PopoverContent>
    </Popover>
  );
});
