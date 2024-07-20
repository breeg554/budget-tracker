import React, { ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

import { CreateTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { assert } from '~/utils/assert';
import { toBase64 } from '~/utils/files';

import { ReceiptScanner } from './ReceiptScanner';
import { useScanReducer } from './scan.reducer';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    hasText,
    error,
    receiptItems,
    step,
    openScanner,
    closeScanner,
    onScan,
    onUpload,
  } = useScanReducer({ organizationId, pipelineId });

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleOnScan = (image: string) => {
    onScan(image);
  };

  const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = await toBase64(e.target.files[0]);
      if (typeof file === 'string') {
        onUpload(file);
      }
    }
  };

  const handleOnRetrieve = () => {
    assert(receiptItems);

    onRetrieve(receiptItems);
  };

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <>
            {triggers({
              takePhoto: openScanner,
              uploadPhoto: openPicker,
            })}

            <UploadInput onChange={handleOnUpload} ref={inputRef} />
          </>
        );
      case 'scan':
        return createPortal(
          <ReceiptScanner onClose={closeScanner} onScan={handleOnScan} />,
          document.body,
        );
      case 'preview':
        if (error) return <p>{error}</p>;
        if (!hasText) return <p>Retrieving text from image...</p>;
        if (!receiptItems) return <p>Analyzing... Let's AI do some magic...</p>;
        return (
          <div>
            <p>found {receiptItems.length} items.</p>
            <button type="button" onClick={handleOnRetrieve}>
              Let's see
            </button>
          </div>
        );
      default:
        return null;
    }
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
