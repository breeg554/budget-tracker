import React from 'react';
import { DayPickerSingleProps } from 'react-day-picker';
import { format } from 'date-fns';

import { Button } from '~/buttons/Button';
import { CalendarIcon } from '~/icons/CalendarIcon';
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
