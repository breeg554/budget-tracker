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
      onDateChange({
        startDate: new CustomDate(startDate).addDays(1).formatISO(),
        endDate: new CustomDate(endDate).addDays(1).formatISO(),
      });
    } else if (difference <= 7) {
      const newStartDate = new CustomDate(startDate)
        .addWeeks(1)
        .startOfWeek()
        .formatISO();
      const newEndDate = new CustomDate(newStartDate).endOfWeek().formatISO();
      onDateChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    } else {
      const newStartDate = new CustomDate(startDate)
        .addMonths(1)
        .startOfMonth()
        .formatISO();
      const newEndDate = new CustomDate(newStartDate).endOfMonth().formatISO();
      onDateChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  };

  const onPrevious = (difference: number) => {
    if (difference <= 1) {
      onDateChange({
        startDate: new CustomDate(startDate).addDays(-1).formatISO(),
        endDate: new CustomDate(endDate).addDays(-1).formatISO(),
      });
    } else if (difference <= 7) {
      const newStartDate = new CustomDate(startDate)
        .addWeeks(-1)
        .startOfWeek()
        .formatISO();
      const newEndDate = new CustomDate(newStartDate).endOfWeek().formatISO();

      onDateChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    } else {
      const newStartDate = new CustomDate(startDate)
        .addMonths(-1)
        .startOfMonth()
        .formatISO();
      const newEndDate = new CustomDate(newStartDate).endOfMonth().formatISO();
      onDateChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
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
    return acc + transaction.price;
  }, 0);

  return (
    <Card className={cn('relative border-none shadow-none', className)}>
      <CardHeader className="mb-6 pt-5">
        {headerDates()}
        <CardTitle className="font-semibold text-center text-2xl">
          {new MonetaryValue(sumPrice).format()}
          <span className="text-sm">PLN</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <TransactionChart data={data} startDate={startDate} endDate={endDate} />
      </CardContent>
    </Card>
  );
};
