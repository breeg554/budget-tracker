import React, { ReactNode, useRef } from 'react';
import { useFetcher } from '@remix-run/react';

import { isFromProcessReceiptSchema } from '~/api/Receipt/receiptApi.contracts';
import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
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
  onRetrieve: (items: Partial<CreateTransactionItemDto>[]) => void;
  organizationId: number;
  pipelineId: number;
}

export const ReceiptRetriever: React.FC<ReceiptRetrieverProps> = ({
  triggers,
  onRetrieve,
  organizationId,
  pipelineId,
}) => {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      fetcher.submit(formData, {
        method: 'post',
        encType: 'multipart/form-data',
      });

      e.target.value = '';
    }
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
      return (
        <div>
          <p>Found {data.products.length} products</p>

          <ItemList
            items={data.products.map((product) => ({
              ...product,
              id: product.name,
            }))}
            renderItem={(product) => (
              <p>
                {product.name}: {product.price} * {product.quantity}
              </p>
            )}
          />

          <button type="button" onClick={() => onRetrieve(data.products)}>
            Let's see
          </button>
        </div>
      );
    }

    return (
      <>
        {triggers({
          takePhoto: () => {},
          uploadPhoto: openPicker,
        })}

        <UploadInput onChange={handleOnUpload} ref={inputRef} />
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
