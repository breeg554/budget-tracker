import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  useLoaderData,
  useMatch,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';

import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import {
  DescriptionRow,
  DescriptionRowContent,
  DescriptionRowName,
} from '~/dashboard/organization/receipts/receipt/components/DescriptionRows.components';
import { useDeleteTransactionItem } from '~/dashboard/organization/receipts/transactions.hooks';
import { ChevronLeftIcon } from '~/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '~/icons/ChevronRightIcon';
import { routes } from '~/routes';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerFooter,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { cn } from '~/utils/cn';

import { loader } from './loader.server';

export const ItemPage = () => {
  const navigate = useNavigate();
  const { action: deleteAction } = useDeleteTransactionItem();
  const [params] = useSearchParams();
  const match = useMatch(routes.receiptItem.pattern);
  const { transactionItem, organizationName, transactionId } =
    useLoaderData<typeof loader>();
  const { nextItem, previousItem } = useOutletContext<{
    nextItem?: (index: string) => void;
    previousItem?: (index: string) => void;
  }>();

  const isOpen = !!match;

  const onClose = (value: boolean) => {
    if (value) return;
    navigate(
      routes.receipt.getPath(
        organizationName,
        transactionId,
        Object.fromEntries(params.entries()),
      ),
      { preventScrollReset: true },
    );
  };

  const onNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    nextItem?.(transactionItem.id);
  };

  const onPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    previousItem?.(transactionItem.id);
  };

  const onDelete = () => {
    deleteAction(transactionItem.id);
  };

  return (
    <DialogDrawer open={isOpen} onOpenChange={onClose}>
      <DialogDrawerContent>
        <DialogDrawerHeader>
          <DialogDrawerTitle>
            <IconButton
              size="xxs"
              variant="ghost"
              type="button"
              icon={<ChevronLeftIcon />}
              onClick={onPrevious}
              className={cn({ hidden: !previousItem })}
            />

            <span className="px-2">{transactionItem.name}</span>

            <IconButton
              size="xxs"
              variant="ghost"
              type="button"
              icon={<ChevronRightIcon />}
              onClick={onNext}
              className={cn({ hidden: !nextItem })}
            />
          </DialogDrawerTitle>
        </DialogDrawerHeader>

        <DialogDrawerBody>
          <div className="flex flex-col divide-y mt-2">
            <DescriptionRow>
              <DescriptionRowName>Total</DescriptionRowName>
              <DescriptionRowContent>
                {transactionItem.price.total.formatted}
              </DescriptionRowContent>
            </DescriptionRow>

            <DescriptionRow>
              <DescriptionRowName>Quantity</DescriptionRowName>
              <DescriptionRowContent>
                {transactionItem.price.quantity}
              </DescriptionRowContent>
            </DescriptionRow>

            <DescriptionRow>
              <DescriptionRowName>Category</DescriptionRowName>
              <DescriptionRowContent>
                <span className="mr-1">{transactionItem.category.icon}</span>
                <span>{transactionItem.category.name}</span>
              </DescriptionRowContent>
            </DescriptionRow>
          </div>
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
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data ? data?.transactionItem.name : 'Item',
    },
  ];
};
