import React, { ReactNode, useEffect, useRef } from 'react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useBoolean } from 'usehooks-ts';

import { ReceiptProduct } from '~/api/Receipt/receiptApi.types';
import { TransactionItemType } from '~/api/Transaction/transactionApi.contracts';
import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { OnStatusChangeCb } from '~/clients/ReceiptProcessSocket';
import { ReceiptScanner } from '~/dashboard/organization/receipts/new/scan/components/ReceiptScanner';
import { loader } from '~/dashboard/organization/receipts/new/scan/loader.server';
import { useProcessReceipt } from '~/dashboard/organization/receipts/new/scan/useProcessReceipt';
import { ItemList } from '~/list/ItemList';

import { action } from '../action.server';

export type RetrieveState = 'idle' | 'processing' | 'done';

interface ReceiptRetrieverProps {
  triggers: ({
    takePhoto,
    uploadPhoto,
  }: {
    takePhoto: () => void;
    uploadPhoto: () => void;
  }) => ReactNode;
  onRetrieve: (retrieved: Partial<CreateTransactionDto>) => void;
  onStateChange?: (state: RetrieveState) => void;
}

export const ReceiptRetriever: React.FC<ReceiptRetrieverProps> = ({
  triggers,
  onRetrieve,
  onStateChange,
}) => {
  const { pageUrl } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    value: isScannerOpen,
    setTrue: openScanner,
    setFalse: closeScanner,
  } = useBoolean(false);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
    }

    e.target.value = '';
  };

  const onScan = (file: File) => {
    onUpload(file);

    closeScanner();
  };

  const onStatusChange: OnStatusChangeCb = (status) => {
    switch (status) {
      case 'idle':
        onStateChange?.('idle');
        break;
      case 'image-processing':
        onStateChange?.('processing');
        break;
      case 'content-processing':
        onStateChange?.('processing');
        break;
      case 'done':
        onStateChange?.('done');
        break;
    }
  };

  const {
    status: processingStatus,
    data: processResult,
    processReceipt,
  } = useProcessReceipt(pageUrl, {
    callbacks: { onStatusChange },
  });

  const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    fetcher.submit(formData, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      //eslint-disable-next-line
      //@ts-ignore
      processReceipt(fetcher.data.fileUrl);
    } else if (fetcher.state !== 'idle') {
      onStateChange?.('processing');
    }
  }, [fetcher.state]);

  const renderStep = () => {
    if (processingStatus === 'image-processing') {
      return <p>We are processing the receipt image...</p>;
    } else if (processingStatus === 'content-processing') {
      return <p>We are processing the receipt content...</p>;
    } else if (processingStatus === 'done' && !processResult) {
      return <p>Jus a moment...</p>;
    } else if (processingStatus === 'done' && processResult) {
      const transactionItems = toTransactionItem(processResult.products);

      return (
        <div>
          <p>Place: {processResult.place}</p>
          <p>Date: {processResult.date}</p>

          <p className="my-2">Items:</p>
          <ItemList
            items={transactionItems.map((product) => ({
              ...product,
              id: product.name,
            }))}
            renderItem={(product) => (
              <p>
                {product.name}: {product.quantity.toFixed(2)} *{' '}
                {product.price.toFixed(2)}
              </p>
            )}
          />

          <button
            type="button"
            onClick={() =>
              onRetrieve({
                date: processResult.date ?? undefined,
                name: processResult.place ?? undefined,
                items: transactionItems,
              })
            }
          >
            Let's see
          </button>
        </div>
      );
    } else if (fetcher.state !== 'idle') {
      return <p>Uploading the receipt...</p>;
    }

    return (
      <>
        {triggers({
          takePhoto: openScanner,
          uploadPhoto: openPicker,
        })}

        <UploadInput ref={inputRef} onChange={onChange} />

        {isScannerOpen ? (
          <ReceiptScanner onClose={closeScanner} onScan={onScan} />
        ) : null}
      </>
    );
  };

  return <>{renderStep()}</>;
};

interface UploadInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadInput = React.forwardRef<HTMLInputElement, UploadInputProps>(
  ({ onChange }, ref) => {
    return (
      <input
        type="file"
        accept="image/png, image/webp, image/jpeg"
        className="hidden"
        onChange={onChange}
        multiple={false}
        ref={ref}
      />
    );
  },
);

function toTransactionItem(items: ReceiptProduct[]) {
  return items.map((item) => ({
    ...item,
    type: 'outcome' as TransactionItemType,
  }));
}
