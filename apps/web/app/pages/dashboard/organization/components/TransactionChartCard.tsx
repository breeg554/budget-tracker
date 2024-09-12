import React from 'react';

import { IconButton } from '~/buttons/IconButton';
import { ClientDate } from '~/dates/ClientDate';
import { ChevronLeftIcon } from '~/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '~/icons/ChevronRightIcon';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { cn } from '~/utils/cn';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { TransactionChart, TransactionChartProps } from './TransactionChart';

interface TransactionChartCardProps extends TransactionChartProps {
  onDateChange: (args: { startDate: string; endDate: string }) => void;
  className?: string;
}

export const TransactionChartCard = ({
  className,
  startDate,
  endDate,
  data,
  onDateChange,
}: TransactionChartCardProps) => {
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

  const headerDates = () => {
    const difference = Math.abs(
      new CustomDate(startDate).differenceInDays(endDate),
    );
    let format = 'dd MMM yyyy';

    if (difference <= 1) {
      format = 'dd MMM HH:mm';
    }

    return (
      <div className="flex items-center gap-2 justify-center">
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

  const sumPrice = data.reduce((acc, transaction) => {
    return acc.add(new MonetaryValue(transaction.price.value));
  }, new MonetaryValue(0));

  return (
    <Card className={cn('relative border-none shadow-none', className)}>
      <CardHeader className="mb-6 pt-5">
        {headerDates()}
        <CardTitle className="font-semibold text-center text-2xl">
          {sumPrice.format()}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <TransactionChart data={data} startDate={startDate} endDate={endDate} />
      </CardContent>
    </Card>
  );
};
