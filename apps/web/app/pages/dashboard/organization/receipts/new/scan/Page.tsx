import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';

import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { routes } from '~/routes';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/ui/drawer';
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
    formData.append('items', JSON.stringify(items));

    fetcher.submit(formData, {
      method: 'POST',
      encType: 'multipart/form-data',
    });
  };

  return (
    <Drawer onOpenChange={onClose} open>
      <DrawerContent
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DrawerHeader>
          <DrawerTitle>Take or upload photo</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>

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
                type="button"
                className="cursor-pointer w-full p-4 border border-neutral-150 rounded"
                onClick={takePhoto}
              >
                Take a photo
              </button>
            </div>
          )}
        />
      </DrawerContent>
    </Drawer>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: 'Scan' }];
};
