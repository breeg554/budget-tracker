import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import groupBy from 'lodash.groupby';

import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { Link } from '~/link/Link';
import { routes } from '~/routes';
import { CustomDate, DateRange } from '~/utils/CustomDate';

import { CategoriesCarousel } from './components/CategoriesCarousel';
import { OrganizationAvatar } from './components/OrganizationAvatar';
import { TransactionChartCard } from './components/TransactionChartCard';
import { TransactionItemList } from './components/TransactionItemList';
import { TransactionModeTabs } from './components/TransactionModeTabs';
import { loader } from './loader.server';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const {
    transactions,
    latestTransactions,
    statsByCategories,
    organizationName,
    startDate,
    endDate,
  } = useLoaderData<typeof loader>();

  const days = groupBy(latestTransactions, ({ date }) =>
    new CustomDate(date).format('dd MMMM'),
  );

  const onTabChange = ({ startDate, endDate }: DateRange) => {
    navigate(
      routes.organization.getPath(organizationName, { startDate, endDate }),
    );
  };

  return (
    <>
      <PageBackground />

      <SectionWrapper className="mt-4 mb-8 flex gap-2 items-center justify-between">
        <p className="text-sm font-light text-primary-foreground">
          Welcome back
        </p>

        <OrganizationAvatar name={organizationName} />
      </SectionWrapper>

      <SectionWrapper className="mb-6">
        <h1 className="text-4xl max-w-[300px] text-primary-foreground">
          Manage your expenses
        </h1>
      </SectionWrapper>

      <TransactionModeTabs
        onValueChange={onTabChange}
        startDate={startDate}
        endDate={endDate}
        className="mb-4 relative"
      />

      <TransactionChartCard
        className="mb-4"
        startDate={startDate}
        endDate={endDate}
        data={transactions}
        onDateChange={onTabChange}
      />

      {statsByCategories.length > 0 && (
        <SectionWrapper className="pl-4 pr-0 mb-3">
          <header className="flex gap-2 justify-between items-center mb-3 pr-4">
            <h2 className="text-sm text-muted-foreground">Categories</h2>

            <Link
              to={routes.statistics.getPath(organizationName)}
              className="text-muted-foreground text-sm"
            >
              See all
            </Link>
          </header>

          <CategoriesCarousel data={statsByCategories.slice(0, 8)} />
        </SectionWrapper>
      )}

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center">
          <h2 className="text-sm text-muted-foreground">Recent transactions</h2>

          <Link
            to={routes.receipts.getPath(organizationName)}
            className="text-muted-foreground text-sm"
          >
            See all
          </Link>
        </header>

        <div className="pb-20">
          <TransactionItemList items={days} />
        </div>
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }];
};
