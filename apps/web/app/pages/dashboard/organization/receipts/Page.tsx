import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FilterIcon } from 'lucide-react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { IconButton } from '~/buttons/IconButton';
import { OrganizationAvatar } from '~/dashboard/organization/components/OrganizationAvatar';
import { ReceiptsList } from '~/dashboard/organization/receipts/components/ReceiptsList';
import { useInfiniteFetcher } from '~/hooks/useInfiniteFetcher';
import { TextInput } from '~/inputs/TextInput';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';

import { loader } from './loader.server';

export const ReceiptsPage = () => {
  const { ref: fetchNextRef, inView } = useInView();
  const { organizationName, transactions, pagination } =
    useLoaderData<typeof loader>();

  const { data, fetchNextPage } = useInfiniteFetcher<
    GetTransactionDto,
    typeof loader
  >({
    pagination,
    initialData: transactions,
    loaderUrl: routes.receipts.getPath(organizationName),
    dataExtractor: (response) => response.data?.transactions,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

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

      <SectionWrapper className="pb-20">
        <p className="mx-auto mb-4 text-center">Transactions</p>

        <div className="flex gap-1 items-center mb-4">
          <TextInput placeholder="Search..." />
          <IconButton icon={<FilterIcon />} variant="secondary" />
        </div>

        <ReceiptsList transactions={data} />

        <div
          ref={fetchNextRef}
          className="w-10 h-10 pointer-events-none opacity-0"
        />
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
