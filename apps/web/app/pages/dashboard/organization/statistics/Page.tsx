import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { DateRangeUpdater } from '~/dashboard/organization/components/DateRangeUpdater';
import { TransactionModeTabs } from '~/dashboard/organization/components/TransactionModeTabs';
import { useOrganizationName } from '~/hooks/useOrganizationName';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';
import { DateRange } from '~/utils/CustomDate';

import { CategoriesPieChart } from './components/CategoriesPieChart';
import { loader } from './loader.server';

export const StatisticsPage = () => {
  const { statsByCategories, startDate, endDate } =
    useLoaderData<typeof loader>();

  const organizationName = useOrganizationName();
  const navigate = useNavigate();

  const onTabChange = ({ startDate, endDate }: DateRange) => {
    navigate(
      routes.statistics.getPath(organizationName, { startDate, endDate }),
    );
  };

  return (
    <>
      <PageBackground className="h-[190px]" />

      <SectionWrapper className="h-[65px]">
        <h1 className="text-primary-foreground text-sm text-center mt-4 mb-8">
          Statistics
        </h1>
      </SectionWrapper>

      <TransactionModeTabs
        onValueChange={onTabChange}
        startDate={startDate}
        endDate={endDate}
        className="mb-4 relative"
      />

      <DateRangeUpdater
        className="pt-5 relative"
        onDateChange={onTabChange}
        startDate={startDate}
        endDate={endDate}
      />

      <SectionWrapper className="mt-10">
        <CategoriesPieChart data={statsByCategories} />
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Statistics' }];
};
