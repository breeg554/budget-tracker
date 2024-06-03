import React, { ReactNode, useRef } from "react";
import { RecipeScanner } from "./RecipeScanner";
import { useScanReducer } from "./scan.reducer";
import { toBase64 } from "~/utils/files";
import { CreateTransactionItemDto } from "~/api/Transaction/transactionApi.types";
import { assert } from "~/utils/assert";

interface RecipeRetrieverProps {
  triggers: ({
    takePhoto,
    uploadPhoto,
  }: {
    takePhoto: () => void;
    uploadPhoto: () => void;
  }) => ReactNode;
  onRetrieve: (items: Partial<CreateTransactionItemDto>[]) => void;
}

export const RecipeRetriever: React.FC<RecipeRetrieverProps> = ({
  triggers,
  onRetrieve,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    hasText,
    error,
    recipeItems,
    step,
    openScanner,
    closeScanner,
    onScan,
    onUpload,
  } = useScanReducer();

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleOnScan = (image: string) => {
    onScan(image);
  };

  const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = await toBase64(e.target.files[0]);
      if (typeof file === "string") {
        onUpload(file);
      }
    }
  };

  const handleOnRetrieve = () => {
    assert(recipeItems);

    onRetrieve(recipeItems);
  };

  const renderStep = () => {
    switch (step) {
      case "method":
        return (
          <>
            {triggers({
              takePhoto: openScanner,
              uploadPhoto: openPicker,
            })}

            <UploadInput onChange={handleOnUpload} ref={inputRef} />
          </>
        );
      case "scan":
        return <RecipeScanner onClose={closeScanner} onScan={handleOnScan} />;
      case "preview":
        if (error) return <p>{error}</p>;
        if (!hasText) return <p>Retrieving text from image...</p>;
        if (!recipeItems) return <p>Analyzing... Let's AI do some magic...</p>;
        return (
          <div>
            <p>found {recipeItems.length} items.</p>
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
