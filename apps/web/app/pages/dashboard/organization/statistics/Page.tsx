import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { useOrganizationName } from '~/hooks/useOrganizationName';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';
import { Tabs, TabsList, TabsTrigger } from '~/ui/tabs';
import { CustomDate } from '~/utils/CustomDate';

import { CategoriesPieChart } from './components/CategoriesPieChart';
import { loader } from './loader.server';

export const StatisticsPage = () => {
  const { statsByCategories, startDate, endDate } =
    useLoaderData<typeof loader>();

  const organizationName = useOrganizationName();
  const navigate = useNavigate();

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
      routes.statistics.getPath(organizationName, { startDate, endDate }),
    );
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
    <>
      <PageBackground />

      <SectionWrapper>
        <h1 className="text-primary-foreground text-sm text-center mt-4 mb-8">
          Statistics
        </h1>
      </SectionWrapper>

      <SectionWrapper>
        <Tabs value={getValue()} onValueChange={onValueChange}>
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

        {statsByCategories.length > 0 ? (
          <CategoriesPieChart data={statsByCategories} />
        ) : null}
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Statistics' }];
};
