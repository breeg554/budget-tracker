import { useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

import { useOrganizationName } from '~/hooks/useOrganizationName';
import { confirm } from '~/modals/confirm';
import { routes } from '~/routes';

export const useDeleteReceipt = () => {
  const organizationName = useOrganizationName();
  const fetcher = useFetcher();

  const action = useCallback(
    (transactionId: string) => {
      confirm({
        children:
          'You are about to delete this transaction. This action is irreversible.',
        onConfirm: () =>
          fetcher.submit(
            { id: transactionId },
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
