import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useMatch,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';

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
  const [params] = useSearchParams();
  const match = useMatch({ path: routes.receipt.pattern, end: false });
  const { transaction, transactionId, organizationName } =
    useLoaderData<typeof loader>();

  const isOpen = !!match;

  const onClose = (value: boolean) => {
    if (value) return;
    navigate(
      routes.receipts.getPath(
        organizationName,
        Object.fromEntries(params.entries()),
      ),
      { preventScrollReset: true },
    );
  };

  const nextItem = (currentId: string) => {
    const currentIndex = transaction.items.findIndex(
      (item) => item.id === currentId,
    );

    let itemId: string | undefined;

    if (currentIndex === transaction.items.length - 1) {
      itemId = transaction.items[0].id;
    } else {
      itemId = transaction.items[currentIndex + 1].id;
    }

    return navigate(
      routes.receiptItem.getPath(
        organizationName,
        transactionId,
        itemId,
        Object.fromEntries(params.entries()),
      ),
      { preventScrollReset: true },
    );
  };

  const previousItem = (currentId: string) => {
    const currentIndex = transaction.items.findIndex(
      (item) => item.id === currentId,
    );

    let itemId: string | undefined;

    if (currentIndex === 0) {
      itemId = transaction.items[transaction.items.length - 1].id;
    } else {
      itemId = transaction.items[currentIndex - 1].id;
    }

    return navigate(
      routes.receiptItem.getPath(
        organizationName,
        transactionId,
        itemId,
        Object.fromEntries(params.entries()),
      ),
      { preventScrollReset: true },
    );
  };

  return (
    <>
      <DialogDrawer open={isOpen} onOpenChange={onClose}>
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

      <Outlet context={{ nextItem, previousItem }} />
    </>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.transaction.name }];
};
