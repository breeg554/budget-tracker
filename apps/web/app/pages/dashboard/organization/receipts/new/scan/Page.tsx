import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';

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
import { loader } from './loader.server';

export const ScanPage = () => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { organizationId, pipelineId } = useLoaderData<typeof loader>();

  const onClose = () => {
    navigate(routes.newReceipt.getPath(organizationName));
  };

  const onRetrieve = (items: Partial<CreateTransactionItemDto>[]) => {
    const formData = new FormData();
    formData.append(
      'items',
      JSON.stringify(items.map((item) => ({ ...item, type: 'outcome' }))),
    );

    fetcher.submit(formData, {
      method: 'PUT',
      encType: 'multipart/form-data',
    });
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
            organizationId={organizationId}
            pipelineId={pipelineId}
            onRetrieve={onRetrieve}
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
                  disabled
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
