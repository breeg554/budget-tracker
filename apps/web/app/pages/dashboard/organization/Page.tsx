import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import groupBy from 'lodash.groupby';

import { SectionWrapper } from '~/layout/SectionWrapper';
import { Link } from '~/link/Link';
import { routes } from '~/routes';
import { CustomDate } from '~/utils/CustomDate';

import { OrganizationAvatar } from './components/OrganizationAvatar';
import { TransactionItemList } from './components/TransactionItemList';
import { TransactionModeTabs } from './components/TransactionModeTabs';
import { loader } from './loader.server';

export const DashboardPage = () => {
  const {
    transactions,
    latestTransactions,
    organizationName,
    startDate,
    endDate,
  } = useLoaderData<typeof loader>();

  const days = groupBy(latestTransactions, ({ date }) =>
    new CustomDate(date).format('dd MMMM'),
  );

  return (
    <>
      <div className="absolute z-0 left-0 right-0 top-0 bg-green-950 w-full h-[300px] rounded-b-2xl" />

      <SectionWrapper className="mt-4 mb-8 flex gap-2 items-center justify-between relative">
        <p className="text-sm font-light text-primary-foreground">
          Welcome back
        </p>

        <OrganizationAvatar name={organizationName} />
      </SectionWrapper>

      <SectionWrapper className="mb-6 relative">
        <h1 className="text-4xl max-w-[300px] text-primary-foreground">
          Manage your expenses
        </h1>
      </SectionWrapper>

      <TransactionModeTabs
        transactions={transactions}
        startDate={startDate}
        endDate={endDate}
        className="mb-8 relative"
      />

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center mb-2">
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
