import { useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

import { useOrganizationName } from '~/hooks/useOrganizationName';
import { useTransactionId } from '~/hooks/useTransactionId';
import { confirm } from '~/modals/confirm';
import { routes } from '~/routes';

export const useDeleteTransaction = () => {
  const organizationName = useOrganizationName();
  const fetcher = useFetcher();

  const action = useCallback(
    (id: string) => {
      confirm({
        children:
          'You are about to delete this transaction. This action is irreversible.',
        onConfirm: () =>
          fetcher.submit(
            { id },
            {
              method: 'delete',
              action: routes.receipts.getPath(organizationName),
            },
          ),
      });
    },
    [fetcher, organizationName],
  );

  return { action, fetcher };
};

export const useDeleteTransactionItem = () => {
  const organizationName = useOrganizationName();
  const transactionId = useTransactionId();
  const fetcher = useFetcher();

  const action = useCallback(
    (id: string) => {
      confirm({
        children:
          'You are about to delete this item. This action is irreversible.',
        onConfirm: () =>
          fetcher.submit(
            { id },
            {
              method: 'delete',
              action: routes.receiptItem.getPath(
                organizationName,
                transactionId,
                id,
              ),
            },
          ),
      });
    },
    [fetcher, organizationName, transactionId],
  );

  return { action, fetcher };
};
