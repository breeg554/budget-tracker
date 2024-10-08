import React, { ReactNode, useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { useBoolean } from 'usehooks-ts';

import { isFromProcessReceiptSchema } from '~/api/Receipt/receiptApi.contracts';
import { ReceiptProduct } from '~/api/Receipt/receiptApi.types';
import { TransactionItemType } from '~/api/Transaction/transactionApi.contracts';
import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { ReceiptScanner } from '~/dashboard/organization/receipts/new/scan/components/ReceiptScanner';
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

  const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    fetcher.submit(formData, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  const isLoading = fetcher.state !== 'idle';
  const data = fetcher.data;

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      onStateChange?.('done');
    } else if (fetcher.state === 'idle') {
      onStateChange?.('idle');
    } else {
      onStateChange?.('processing');
    }
  }, [fetcher.state]);

  const renderStep = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (data) {
      if (!isFromProcessReceiptSchema(data)) {
        return <p>Ups. Something went wrong...</p>;
      }

      const transactionItems = toTransactionItem(data.products);

      return (
        <div>
          <p>Place: {data.place}</p>
          <p>Date: {data.date}</p>

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
                date: data.date ?? undefined,
                name: data.place ?? undefined,
                items: transactionItems,
              })
            }
          >
            Let's see
          </button>
        </div>
      );
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
