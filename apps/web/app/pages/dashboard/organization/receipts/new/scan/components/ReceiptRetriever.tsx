import React, { ReactNode, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { useBoolean } from 'usehooks-ts';

import { isFromProcessReceiptSchema } from '~/api/Receipt/receiptApi.contracts';
import { ReceiptProduct } from '~/api/Receipt/receiptApi.types';
import { TransactionItemType } from '~/api/Transaction/transactionApi.contracts';
import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { ReceiptScanner } from '~/dashboard/organization/receipts/new/scan/components/ReceiptScanner';
import { ItemList } from '~/list/ItemList';

import { action } from '../action.server';

interface ReceiptRetrieverProps {
  triggers: ({
    takePhoto,
    uploadPhoto,
  }: {
    takePhoto: () => void;
    uploadPhoto: () => void;
  }) => ReactNode;
  onRetrieve: (items: CreateTransactionItemDto[]) => void;
}

export const ReceiptRetriever: React.FC<ReceiptRetrieverProps> = ({
  triggers,
  onRetrieve,
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
          <p>Found {transactionItems.length} products</p>

          <ItemList
            items={transactionItems.map((product) => ({
              ...product,
              id: product.name,
            }))}
            renderItem={(product) => (
              <p>
                {product.name}: {product.price} * {product.quantity}
              </p>
            )}
          />

          <button type="button" onClick={() => onRetrieve(transactionItems)}>
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
