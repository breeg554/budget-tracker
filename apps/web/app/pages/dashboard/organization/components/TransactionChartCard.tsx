import React from 'react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card';
import { cn } from '~/utils/cn';
import { MonetaryValue } from '~/utils/MonetaryValue';

interface TransactionChartCardProps {
  className?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
  data: GetTransactionDto[];
}

export const TransactionChartCard = ({
  className,
  data,
  header,
  content,
}: TransactionChartCardProps) => {
  const sumPrice = data.reduce((acc, transaction) => {
    return acc.add(new MonetaryValue(transaction.price.value));
  }, new MonetaryValue(0));

  return (
    <Card className={cn('relative border-none shadow-none', className)}>
      <CardHeader className="mb-6 pt-5">
        {header}

        <CardTitle className="font-semibold text-center text-2xl">
          {sumPrice.format()}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">{content}</CardContent>
    </Card>
  );
};
