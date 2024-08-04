import type { MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import groupBy from 'lodash.groupby';

import { SectionWrapper } from '~/layout/SectionWrapper';
import { Link } from '~/link/Link';
import { routes } from '~/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/ui/card';
import { CustomDate } from '~/utils/CustomDate';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { TransactionItemList } from './components/TransactionItemList';
import { WeeklyTransactionChart } from './components/WeeklyTransactionChart';
import { loader } from './loader.server';

export const DashboardPage = () => {
  const { transactions, organizationName, startDate, endDate } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const onLogout = () => {
    fetcher.submit(null, { action: routes.signOut.getPath(), method: 'post' });
  };

  const days = groupBy(transactions, ({ date }) =>
    new CustomDate(date).format('dd MMMM'),
  );
  const sumPrice = transactions.reduce((acc, transaction) => {
    return acc + transaction.price;
  }, 0);

  return (
    <>
      {/*<button onClick={onLogout}>Logout</button>*/}
      <SectionWrapper className="mb-10 mt-8 flex gap-2 items-center justify-between">
        <h1 className="text-3xl text-neutral-900">
          <span className="block font-bold">{organizationName}</span>
        </h1>

        {/*<button className="rounded-full border border-neutral-150 w-12 h-12 bg-transparent flex justify-center items-center">*/}
        {/*  <SearchIcon className="w-5 h-5" />*/}
        {/*</button>*/}
      </SectionWrapper>

      {/*<SectionWrapper className="text-center mb-10">*/}
      {/*  <p className="text-muted-foreground text-sm mb-2">This month spend</p>*/}
      {/*  <h3 className="text-5xl font-semibold">*/}
      {/*    {new MonetaryValue(100).format()}*/}
      {/*    <span className="text-lg">PLN</span>*/}
      {/*  </h3>*/}
      {/*</SectionWrapper>*/}

      <SectionWrapper className="mb-6">
        <Card>
          <CardHeader className="mb-6">
            <CardDescription className="text-center">
              {new CustomDate(startDate).format('dd MMM yyyy')} -{' '}
              {new CustomDate(endDate).format('dd MMM yyyy')}
            </CardDescription>
            <CardTitle className="font-semibold text-center text-2xl">
              {new MonetaryValue(sumPrice).format()}
              <span className="text-sm">PLN</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <WeeklyTransactionChart data={transactions} />
          </CardContent>
        </Card>
      </SectionWrapper>

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
