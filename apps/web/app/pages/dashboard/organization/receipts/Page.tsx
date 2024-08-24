import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FilterIcon } from 'lucide-react';

import { IconButton } from '~/buttons/IconButton';
import { OrganizationAvatar } from '~/dashboard/organization/components/OrganizationAvatar';
import { TextInput } from '~/inputs/TextInput';
import { PageBackground } from '~/layout/PageBackground';
import { SectionWrapper } from '~/layout/SectionWrapper';

import { loader } from './loader.server';

export const ReceiptsPage = () => {
  const { organizationName } = useLoaderData<typeof loader>();
  console.log(organizationName);
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

      <SectionWrapper>
        <p className="mx-auto mb-4 text-center">Transactions</p>

        {/*<IconButton icon={<FilterIcon />} size="sm" />*/}
        <div className="flex gap-1 items-center">
          <TextInput placeholder="Search..." />
          <IconButton icon={<FilterIcon />} variant="secondary" />
        </div>
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
