import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';

import { TransactionItemListItem } from '~/dashboard/organization/components/TransactionItemList';
import { ClientDate } from '~/dates/ClientDate';
import { Link } from '~/link/Link';
import { ItemList } from '~/list/ItemList';
import { routes } from '~/routes';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { CustomDate } from '~/utils/CustomDate';

import { loader } from './loader.server';

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const { transaction, transactionId, organizationName } =
    useLoaderData<typeof loader>();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <>
      <DialogDrawer open={true} onOpenChange={onClose}>
        <DialogDrawerContent>
          <DialogDrawerHeader>
            <DialogDrawerTitle
              className="line-clamp-1"
              title={transaction.name}
            >
              {transaction.name}
            </DialogDrawerTitle>
            <DialogDrawerDescription>
              <ClientDate>
                {new CustomDate(transaction.date).format('dd MMM yyy')}
              </ClientDate>
            </DialogDrawerDescription>
          </DialogDrawerHeader>

          <DialogDrawerBody>
            <p className="text-sm text-muted-foreground">
              {transaction.items.length} Item(s)
            </p>

            <ItemList
              className="my-3 flex flex-col gap-2"
              items={transaction.items}
              renderItem={(item) => (
                <Link
                  withQuery
                  to={routes.receiptItem.getPath(
                    organizationName,
                    transactionId,
                    item.id,
                  )}
                >
                  <TransactionItemListItem item={item} />
                </Link>
              )}
            />
          </DialogDrawerBody>
        </DialogDrawerContent>
      </DialogDrawer>

      <Outlet />
    </>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.transaction.name }];
};
