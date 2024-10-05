import React from 'react';

import { IconButton } from '~/buttons/IconButton';
import { ClientDate } from '~/dates/ClientDate';
import { ChevronLeftIcon } from '~/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '~/icons/ChevronRightIcon';
import { cn } from '~/utils/cn';
import { CustomDate } from '~/utils/CustomDate';

interface DateRangeUpdaterProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (args: { startDate: string; endDate: string }) => void;
  startDate: string;
  endDate: string;
}

export const DateRangeUpdater = ({
  onDateChange,
  startDate,
  endDate,
  className,
  ...rest
}: DateRangeUpdaterProps) => {
  const onNext = (difference: number) => {
    if (difference <= 1) {
      onDateChange(CustomDate.getDayRange(startDate, 1));
    } else if (difference <= 7) {
      const dateRange = CustomDate.getWeekRange(startDate, 1);
      onDateChange(dateRange);
    } else {
      const dateRange = CustomDate.getMonthRange(startDate, 1);
      onDateChange(dateRange);
    }
  };

  const onPrevious = (difference: number) => {
    if (difference <= 1) {
      onDateChange(CustomDate.getDayRange(startDate, -1));
    } else if (difference <= 7) {
      const dateRange = CustomDate.getWeekRange(startDate, -1);
      onDateChange(dateRange);
    } else {
      const dateRange = CustomDate.getMonthRange(startDate, -1);
      onDateChange(dateRange);
    }
  };

  const difference = Math.abs(
    new CustomDate(startDate).differenceInDays(endDate),
  );
  let format = 'dd MMM yyyy';

  if (difference <= 1) {
    format = 'dd MMM HH:mm';
  }

  return (
    <div
      className={cn('flex items-center gap-2 justify-center', className)}
      {...rest}
    >
      <IconButton
        className="text-muted-foreground"
        variant="ghost"
        size="xxs"
        icon={<ChevronLeftIcon />}
        onClick={() => onPrevious(difference)}
      />

      <ClientDate>
        <p className="text-sm text-muted-foreground text-center w-fit">
          {new CustomDate(startDate).format(format)} -{' '}
          {new CustomDate(endDate).format(format)}
        </p>
      </ClientDate>

      <IconButton
        className="text-muted-foreground"
        variant="ghost"
        size="xxs"
        icon={<ChevronRightIcon />}
        onClick={() => onNext(difference)}
      />
    </div>
  );
};
