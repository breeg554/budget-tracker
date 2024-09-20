import React, { useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import { uid } from 'uid';

import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { IconButton } from '~/buttons/IconButton';
import { NavFloatingWrapper } from '~/dashboard/layout/components/DashboardNav';
import { SubmitButton } from '~/form/SubmitButton';
import { CrossIcon } from '~/icons/CrossIcon';
import { SectionWrapper } from '~/layout/SectionWrapper';
import { routes } from '~/routes';
import { useOrganizationName } from '~/utils/useOrganizationName';

import { action } from './action.server';
import { TransactionForm } from './components/TransactionForm';
import { loader } from './loader.server';

export const NewReceiptPage = () => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();

  const { itemCategories } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [formKey, setFormKey] = useState(uid());
  const [defaultValues, setDefaultValues] = useState<
    Partial<CreateTransactionDto>
  >({ items: [] });

  const backToDashboard = () => {
    navigate(routes.organization.getPath(organizationName));
  };

  const onRetrieve = (retrieved: Partial<CreateTransactionDto>) => {
    setDefaultValues((prev) => ({
      name: prev.name ?? retrieved.name,
      date: prev.date ?? retrieved.date,
      items: [...(prev.items ?? []), ...(retrieved.items ?? [])],
    }));
    setFormKey(uid());
  };

  return (
    <SectionWrapper className="pb-12">
      <IconButton
        onClick={backToDashboard}
        variant="ghost"
        className="absolute top-4 left-4"
        icon={<CrossIcon />}
      />

      <TransactionForm
        key={formKey}
        id="transaction-form"
        lastResult={lastResult}
        itemCategories={itemCategories}
        defaultValue={defaultValues}
      />

      <Outlet context={{ onRetrieve }} />

      <NavFloatingWrapper>
        <div className="px-4 py-2 flex justify-between">
          <SubmitButton variant="secondary" onClick={backToDashboard}>
            Cancel
          </SubmitButton>

          <SubmitButton type="submit" form="transaction-form">
            Add transaction
          </SubmitButton>
        </div>
      </NavFloatingWrapper>
    </SectionWrapper>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'New Receipt' }];
};
