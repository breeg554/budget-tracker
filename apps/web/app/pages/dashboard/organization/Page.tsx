import React, { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { socket } from '~/clients/Socket';
import { DateRangeUpdater } from '~/dashboard/organization/components/DateRangeUpdater';
import { TransactionChart } from '~/dashboard/organization/components/TransactionChart';
import { ReceiptsList } from '~/dashboard/organization/receipts/components/ReceiptsList';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { Link } from '~/link/Link';
import { routes } from '~/routes';
import { DateRange } from '~/utils/CustomDate';

import { CategoriesCarousel } from './components/CategoriesCarousel';
import { OrganizationAvatar } from './components/OrganizationAvatar';
import { TransactionChartCard } from './components/TransactionChartCard';
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
    apiUrl,
  } = useLoaderData<typeof loader>();

  const onTabChange = ({ startDate, endDate }: DateRange) => {
    navigate(
      routes.organization.getPath(organizationName, { startDate, endDate }),
    );
  };

  useEffect(() => {
    const socketInstance = socket(apiUrl as string)
      .onConnect((socket) => {
        console.log('Connected to the server');
        socket.hello('user');
      })
      .onDisconnect((reason, description) => {
        console.log('Disconnected', reason, description);
      })
      .onHello((data, socket) => {
        console.log(data, socket);
      });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <>
      <PageBackground />

      <SectionWrapper className="pt-4 mb-8 flex gap-2 items-center justify-between">
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
        data={transactions}
        content={
          <TransactionChart
            data={transactions}
            startDate={startDate}
            endDate={endDate}
          />
        }
        header={
          <DateRangeUpdater
            onDateChange={onTabChange}
            startDate={startDate}
            endDate={endDate}
          />
        }
      />

      {statsByCategories.length > 0 && (
        <SectionWrapper className="pl-4 pr-0 mb-4">
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

        <div className="pb-20 pt-4">
          <ReceiptsList transactions={latestTransactions} />
        </div>
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }];
};
