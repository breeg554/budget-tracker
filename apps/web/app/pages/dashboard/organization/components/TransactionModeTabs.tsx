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
    let dateRange = CustomDate.getWeekRange(new Date());

    if (value === 'monthly') {
      dateRange = CustomDate.getMonthRange(new Date());
    }

    onValueChange?.(dateRange);
  };

  const getValue = () => {
    const difference = Math.abs(
      new CustomDate(startDate).differenceInDays(endDate),
    );

    if (difference <= 7) return 'weekly';
    return 'monthly';
  };

  return (
    <Tabs value={getValue()} className={className} onValueChange={onChange}>
      <SectionWrapper className="mb-4">
        <TabsList className="w-full">
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
