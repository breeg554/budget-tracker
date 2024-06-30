import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { Button } from "~/buttons/Button";
import { cn } from "~/utils/cn";
import { CalendarIcon } from "~/icons/CalendarIcon";
import { format } from "date-fns";
import { Calendar } from "~/ui/calendar";
import { DayPickerSingleProps } from "react-day-picker";

export type DateInputProps = Omit<DayPickerSingleProps, "mode">;

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (props) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !props.selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {props.selected ? (
              format(props.selected, "PPP")
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
