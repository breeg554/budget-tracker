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
      <SectionWrapper className="mt-4 mb-8 flex gap-2 items-center justify-between">
        <p className="text-sm text-muted-foreground font-light">Welcome back</p>

        <OrganizationAvatar name={organizationName} />
      </SectionWrapper>

      <SectionWrapper className="mb-6">
        <h1 className="text-4xl">Manage your expenses</h1>
      </SectionWrapper>

      <TransactionModeTabs
        transactions={transactions}
        startDate={startDate}
        endDate={endDate}
        className="mb-8"
      />

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center">
          <h2 className="text-base text-foreground">Recent transactions</h2>

          <Link
            to={routes.receipts.getPath(organizationName)}
            className="text-muted-foreground"
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
