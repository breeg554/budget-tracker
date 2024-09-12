import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { MonetaryValue } from '~/utils/MonetaryValue';

import { loader } from './loader.server';

export const ItemPage = () => {
  const navigate = useNavigate();
  const { transactionItem } = useLoaderData<typeof loader>();

  const onClose = () => {
    navigate('..', { preventScrollReset: true });
  };

  return (
    <>
      <DialogDrawer open={true} onOpenChange={onClose}>
        <DialogDrawerContent>
          <DialogDrawerHeader>
            <DialogDrawerTitle>
              {transactionItem.quantity} x {transactionItem.name}
            </DialogDrawerTitle>
            <DialogDrawerDescription>
              {new MonetaryValue(
                transactionItem.price,
                transactionItem.quantity,
              ).withCurrency()}
            </DialogDrawerDescription>
          </DialogDrawerHeader>
          <DialogDrawerBody>
            <p>category: {transactionItem.category.name}</p>
          </DialogDrawerBody>
        </DialogDrawerContent>
      </DialogDrawer>
    </>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data
        ? `${data?.transactionItem.quantity} x ${data?.transactionItem.name}`
        : 'Item',
    },
  ];
};
