import React from 'react';

import { SectionWrapper } from '~/layout/SectionWrapper';
import { Tabs, TabsList, TabsTrigger } from '~/ui/tabs';
import { CustomDate } from '~/utils/CustomDate';

interface TransactionModeTabsProps {
  startDate: string;
  endDate: string;
  className?: string;
  onValueChange?: (args: { startDate: string; endDate: string }) => void;
}

export const TransactionModeTabs = ({
  startDate,
  endDate,
  className,
  onValueChange,
}: TransactionModeTabsProps) => {
  const onChange = (value: string) => {
    let startDate = new CustomDate(new Date()).startOfWeek().formatISO();
    let endDate = new CustomDate(new Date()).endOfWeek().formatISO();

    if (value === 'daily') {
      startDate = new CustomDate(new Date()).startOfDay().formatISO();
      endDate = new CustomDate(new Date()).endOfDay().formatISO();
    } else if (value === 'monthly') {
      startDate = new CustomDate(new Date()).startOfMonth().formatISO();
      endDate = new CustomDate(new Date()).endOfMonth().formatISO();
    }
    onValueChange?.({ startDate, endDate });
  };

  const getValue = () => {
    const difference = Math.abs(
      new CustomDate(startDate).differenceInDays(endDate),
    );

    if (difference <= 1) return 'daily';
    if (difference <= 7) return 'weekly';
    return 'monthly';
  };

  return (
    <Tabs value={getValue()} className={className} onValueChange={onChange}>
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
    </Tabs>
  );
};
