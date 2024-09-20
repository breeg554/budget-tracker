import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useMatch,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';

import { Button } from '~/buttons/Button';
import { TransactionItemListItem } from '~/dashboard/organization/components/TransactionItemList';
import {
  DescriptionRow,
  DescriptionRowContent,
  DescriptionRowName,
} from '~/dashboard/organization/receipts/receipt/components/DescriptionRows.components';
import { useDeleteTransaction } from '~/dashboard/organization/receipts/transactions.hooks';
import { ClientDate } from '~/dates/ClientDate';
import { Link } from '~/link/Link';
import { ItemList } from '~/list/ItemList';
import { routes } from '~/routes';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerFooter,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { CustomDate } from '~/utils/CustomDate';

import { loader } from './loader.server';

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const { action: deleteAction } = useDeleteTransaction();
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

  const onDelete = () => {
    deleteAction(transactionId);
  };

  const hasMoreThanOneItem = transaction.items.length > 1;

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
          </DialogDrawerHeader>

          <DialogDrawerBody>
            <div className="flex flex-col divide-y mt-2 mb-4">
              <DescriptionRow>
                <DescriptionRowName>Total</DescriptionRowName>
                <DescriptionRowContent title={transaction.price.formatted}>
                  {transaction.price.formatted}
                </DescriptionRowContent>
              </DescriptionRow>

              <DescriptionRow>
                <DescriptionRowName>Date</DescriptionRowName>
                <DescriptionRowContent>
                  <ClientDate>
                    {new CustomDate(transaction.date).format('dd MMM yyy')}
                  </ClientDate>
                </DescriptionRowContent>
              </DescriptionRow>

              <DescriptionRow>
                <DescriptionRowName>Author</DescriptionRowName>
                <DescriptionRowContent title={transaction.author.email}>
                  {transaction.author.email}
                </DescriptionRowContent>
              </DescriptionRow>
            </div>

            <p className="text-sm text-muted-foreground">
              {transaction.items.length} Item(s)
            </p>
            <ItemList
              className="my-3 flex flex-col gap-2"
              items={transaction.items}
              renderItem={(item) => (
                <Link
                  withQuery
                  preventScrollReset
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
          <DialogDrawerFooter>
            <div className="flex gap-1">
              <Button disabled className="grow" variant="secondary" size="sm">
                Edit
              </Button>
              <Button
                className="grow"
                variant="secondary"
                size="sm"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </DialogDrawerFooter>
        </DialogDrawerContent>
      </DialogDrawer>

      <Outlet
        context={{
          nextItem: hasMoreThanOneItem ? nextItem : null,
          previousItem: hasMoreThanOneItem ? previousItem : null,
        }}
      />
    </>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.transaction.name }];
};
