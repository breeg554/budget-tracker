import React from "react";
import type { MetaFunction } from "@remix-run/node";
import { RecipeRetriever } from "~/dashboard/receipts/new/scan/components/RecipeRetriever";
import { Dialog } from "@radix-ui/themes";
import { useFetcher, useNavigate } from "@remix-run/react";
import { routes } from "~/routes";
import { CreateTransactionItemDto } from "~/api/Transaction/transactionApi.types";

export const ScanPage = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const onClose = () => {
    navigate(routes.newReceipt.getPath());
  };

  const onRetrieve = (items: Partial<CreateTransactionItemDto>[]) => {
    console.log(items);
    const formData = new FormData();
    formData.append("items", JSON.stringify(items));

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <Dialog.Root onOpenChange={onClose} defaultOpen>
      <Dialog.Content className="max-w-xl w-full">
        <Dialog.Title>Take or upload photo</Dialog.Title>

        <RecipeRetriever
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "Scan" }];
};
