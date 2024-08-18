import React from 'react';

import { ClientDate } from '~/dates/ClientDate';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { cn } from '~/utils/cn';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { TransactionChart, TransactionChartProps } from './TransactionChart';

interface TransactionChartCardProps extends TransactionChartProps {
  className?: string;
}

export const TransactionChartCard = ({
  className,
  startDate,
  endDate,
  data,
}: TransactionChartCardProps) => {
  const headerDates = () => {
    const difference = Math.abs(
      new CustomDate(startDate).differenceInDays(endDate),
    );

    let format = 'dd MMM yyyy';

    if (difference <= 1) {
      format = 'dd MMM HH:mm';
    }

    return (
      <ClientDate>
        <p className="text-sm text-muted-foreground text-center">
          {new CustomDate(startDate).format(format)} -{' '}
          {new CustomDate(endDate).format(format)}
        </p>
      </ClientDate>
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
