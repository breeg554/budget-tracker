import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useOutletContext } from '@remix-run/react';

import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { Button } from '~/buttons/Button';
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
          <DialogDrawerTitle>Upload photo</DialogDrawerTitle>
          <DialogDrawerDescription>
            Send a photo of your receipt to automatically extract the items.
          </DialogDrawerDescription>
        </DialogDrawerHeader>

        <DialogDrawerBody>
          <ReceiptRetriever
            onRetrieve={retrieve}
            triggers={({ uploadPhoto }) => (
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  type="button"
                  className="h-[58px] w-full"
                  onClick={uploadPhoto}
                >
                  Upload a photo
                </Button>

                {/*<Button*/}
                {/*  type="button"*/}
                {/*  variant="outline"*/}
                {/*  className="h-[58px] w-full"*/}
                {/*  onClick={takePhoto}*/}
                {/*>*/}
                {/*  Take a photo*/}
                {/*</Button>*/}
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
