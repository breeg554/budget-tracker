import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { Button } from '~/buttons/Button';
import { OrganizationAvatar } from '~/dashboard/organization/components/OrganizationAvatar';
import { ReceiptsFilter } from '~/dashboard/organization/receipts/components/ReceiptsFilter';
import { ReceiptsList } from '~/dashboard/organization/receipts/components/ReceiptsList';
import { useInfiniteFetcher } from '~/hooks/useInfiniteFetcher';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';

import { loader } from './loader.server';

export const ReceiptsPage = () => {
  const { ref: fetchNextRef, inView } = useInView();
  const {
    organizationName,
    transactions,
    categories,
    pagination: initialPagination,
  } = useLoaderData<typeof loader>();

  const {
    data,
    filters,
    filterPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFetcher<GetTransactionDto, typeof loader>({
    initialPagination,
    initialData: transactions,
    loaderUrl: routes.receipts.getPath(organizationName),
    dataExtractor: (response) => ({
      data: response.data?.transactions,
      pagination: response.data?.pagination,
    }),
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <>
      <PageBackground className="h-[140px]" />

      <SectionWrapper className="h-[110px] pt-4">
        <div className="flex gap-2 justify-between items-center">
          <p className="text-sm font-light text-primary-foreground">
            Welcome back
          </p>

          <OrganizationAvatar name={organizationName} />
        </div>
      </SectionWrapper>

      <SectionWrapper className="pb-24">
        <p className="mx-auto mb-4 text-center">Transactions</p>

        <ReceiptsFilter
          onFilter={filterPages}
          categories={categories}
          defaultValues={filters}
        />

        <div className="mt-6 flex flex-col gap-2 justify-center">
          <ReceiptsList transactions={data} />

          <Button
            ref={fetchNextRef}
            size="xxs"
            variant="ghost"
            className="text-xs text-muted-foreground"
            disabled={!hasNextPage}
            onClick={fetchNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
