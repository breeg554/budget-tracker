import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useOutletContext } from '@remix-run/react';

import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { routes } from '~/routes';
import {
  DialogDrawer,
  DialogDrawerBody,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from '~/ui/dialog-drawer';
import { useOrganizationName } from '~/utils/useOrganizationName';

import { ReceiptRetriever } from './components/ReceiptRetriever';

export const ScanPage = () => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();
  const { onRetrieve } = useOutletContext<{
    onRetrieve: (items: CreateTransactionItemDto[]) => void;
  }>();

  const onClose = () => {
    navigate(routes.newReceipt.getPath(organizationName));
  };

  const retrieve = (items: CreateTransactionItemDto[]) => {
    onRetrieve(items);
    onClose();
  };

  return (
    <DialogDrawer onOpenChange={onClose} open>
      <DialogDrawerContent
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DialogDrawerHeader>
          <DialogDrawerTitle>Take or upload photo</DialogDrawerTitle>
          <DialogDrawerDescription>
            Send a photo of your receipt to automatically create a transaction.
          </DialogDrawerDescription>
        </DialogDrawerHeader>

        <DialogDrawerBody>
          <ReceiptRetriever
            onRetrieve={retrieve}
            triggers={({ takePhoto, uploadPhoto }) => (
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="cursor-pointer w-full p-4 border border-neutral-150 rounded"
                  onClick={uploadPhoto}
                >
                  Upload a photo
                </button>

                <button
                  type="button"
                  className="w-full bg-muted p-4 text-muted-foreground border border-neutral-150 rounded"
                  onClick={takePhoto}
                >
                  Take a photo
                </button>
              </div>
            )}
          />
        </DialogDrawerBody>
      </DialogDrawerContent>
    </DialogDrawer>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Scan' }];
};
