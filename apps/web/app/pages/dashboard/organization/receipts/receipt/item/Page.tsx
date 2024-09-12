import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  useLoaderData,
  useMatch,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';

import { IconButton } from '~/buttons/IconButton';
import { ChevronLeftIcon } from '~/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '~/icons/ChevronRightIcon';
import { routes } from '~/routes';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { cn } from '~/utils/cn';

import { loader } from './loader.server';

export const ItemPage = () => {
  const navigate = useNavigate();
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
          <DialogDrawerDescription>
            {transactionItem.price.total.formatted}
          </DialogDrawerDescription>
        </DialogDrawerHeader>
        <DialogDrawerBody>
          <p>category: {transactionItem.category.name}</p>
        </DialogDrawerBody>
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
