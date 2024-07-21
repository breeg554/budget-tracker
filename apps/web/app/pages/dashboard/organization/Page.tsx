import type { MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import groupBy from 'lodash.groupby';

import { SearchIcon } from '~/icons/SearchIcon';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';

import { TransactionItemList } from './components/TransactionItemList';
import { loader } from './loader.server';

export const DashboardPage = () => {
  const { transactions, organizationName } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const onLogout = () => {
    fetcher.submit(null, { action: routes.signOut.getPath(), method: 'post' });
  };

  const days = groupBy(transactions, ({ date }) =>
    dayjs(date).format('DD MMMM'),
  );

  return (
    <>
      <button onClick={onLogout}>Logout</button>

      <SectionWrapper className="mb-6 mt-10 flex gap-2 items-center justify-between">
        <h1 className="text-4xl text-neutral-900">
          <span className="block font-bold">{organizationName}</span>
        </h1>

        <button className="rounded-full border border-neutral-150 w-12 h-12 bg-transparent flex justify-center items-center">
          <SearchIcon className="w-5 h-5" />
        </button>
      </SectionWrapper>

      <SectionWrapper className="mb-6">
        <div className="bg-primary w-full h-[200px] rounded-3xl" />
      </SectionWrapper>

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center mb-2">
          <h2 className="text-neutral-900">Spending</h2>

          <p>select</p>
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
