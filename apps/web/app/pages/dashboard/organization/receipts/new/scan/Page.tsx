import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useNavigate, useOutletContext } from '@remix-run/react';

import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { Button } from '~/buttons/Button';
import { confirm } from '~/modals/confirm';
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

import { ReceiptRetriever, RetrieveState } from './components/ReceiptRetriever';

export const ScanPage = () => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();
  const { onRetrieve } = useOutletContext<{
    onRetrieve: (retrieved: Partial<CreateTransactionDto>) => void;
  }>();

  const [processingState, setProcessingState] =
    React.useState<RetrieveState>('idle');

  const onClose = () => {
    if (processingState !== 'idle') {
      confirm({
        children:
          'You are currently processing a receipt. Are you sure you want to leave this page?',
        onConfirm: () => navigate(routes.newReceipt.getPath(organizationName)),
      });
    } else {
      navigate(routes.newReceipt.getPath(organizationName));
    }
  };

  const retrieve = (retrieved: Partial<CreateTransactionDto>) => {
    onRetrieve(retrieved);
    onClose();
  };

  return (
    <DialogDrawer
      onOpenChange={onClose}
      dismissible={processingState === 'idle'}
      open
    >
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
            onStateChange={setProcessingState}
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
