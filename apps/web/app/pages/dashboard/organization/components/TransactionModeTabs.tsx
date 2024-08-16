import React from 'react';
import { useNavigate } from '@remix-run/react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { useOrganizationName } from '~/hooks/useOrganizationName';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { TransactionChart } from './TransactionChart';

interface TransactionModeTabsProps {
  transactions: GetTransactionDto[];
  startDate: string;
  endDate: string;
  className?: string;
}

export const TransactionModeTabs = ({
  transactions,
  startDate,
  endDate,
  className,
}: TransactionModeTabsProps) => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();
  const sumPrice = transactions.reduce((acc, transaction) => {
    return acc + transaction.price;
  }, 0);

  const onValueChange = (value: string) => {
    let startDate = new CustomDate(new Date()).startOfWeek().formatISO();
    let endDate = new CustomDate(new Date()).endOfWeek().formatISO();

    if (value === 'daily') {
      startDate = new CustomDate(new Date()).startOfDay().formatISO();
      endDate = new CustomDate(new Date()).endOfDay().formatISO();
    } else if (value === 'monthly') {
      startDate = new CustomDate(new Date()).startOfMonth().formatISO();
      endDate = new CustomDate(new Date()).endOfMonth().formatISO();
    }

    navigate(
      routes.organization.getPath(organizationName, { startDate, endDate }),
    );
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
      <>
        {new CustomDate(startDate).format(format)} -{' '}
        {new CustomDate(endDate).format(format)}
      </>
    );
  };

  return (
    <Tabs
      defaultValue="weekly"
      className={className}
      onValueChange={onValueChange}
    >
      <SectionWrapper className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="w-full">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="w-full">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="w-full">
            Monthly
          </TabsTrigger>
        </TabsList>
      </SectionWrapper>

      <Card className="border-none shadow-none mb-8">
        <CardHeader className="mb-6">
          <CardDescription className="text-center">
            {headerDates()}
          </CardDescription>
          <CardTitle className="font-semibold text-center text-2xl">
            {new MonetaryValue(sumPrice).format()}
            <span className="text-sm">PLN</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <TabsContent value="daily">
            <TransactionChart
              data={transactions}
              startDate={startDate}
              endDate={endDate}
            />
          </TabsContent>
          <TabsContent value="weekly">
            <TransactionChart
              data={transactions}
              startDate={startDate}
              endDate={endDate}
            />
          </TabsContent>
          <TabsContent value="monthly">
            <TransactionChart
              data={transactions}
              startDate={startDate}
              endDate={endDate}
            />
          </TabsContent>

          {/*{weeklyTransactions.length > 0 ? (*/}
          {/*  <WeeklyTransactionChart data={weeklyTransactions} />*/}
          {/*) : (*/}
          {/*  <EmptyMessage className="flex justify-center items-center mb-2">*/}
          {/*    No transactions during current week.*/}
          {/*  </EmptyMessage>*/}
          {/*)}*/}
        </CardContent>
      </Card>

      {/*<TabsContent value="account">*/}
      {/*  Make changes to your account here.*/}
      {/*</TabsContent>*/}
      {/*<TabsContent value="password">Change your password here.</TabsContent>*/}
    </Tabs>
  );
};
