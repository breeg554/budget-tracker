import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/buttons/Button";
import { Form } from "~/form/Form";
import { RecipeScanner } from "~/dashboard/receipts/new/scan/components/RecipeScanner";
import { IconButton } from "~/buttons/IconButton";
import { ColumnsIcon } from "~/icons/ColumnsIcon";
import { useState } from "react";
import { RecipeRetriever } from "~/dashboard/receipts/new/scan/components/RecipeRetriever";

export const ScanPage = () => {
  const [items, setItems] = useState([]);
  return (
    <Form method="POST">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify([
          {
            amount: "2",
            category: "83eee60e-035c-44f3-bcf8-4f9f264cf34d",
            name: "Test",
            type: "outcome",
            value: "2",
          },
        ])}
      />

      <RecipeRetriever
        triggers={({ takePhoto, uploadPhoto }) => (
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="cursor-pointer w-full p-4 border border-neutral-150 rounded"
              onClick={takePhoto}
            >
              Take a photo
            </button>

            <button
              type="button"
              className="cursor-pointer w-full p-4 border border-neutral-150 rounded"
              onClick={uploadPhoto}
            >
              Upload a photo
            </button>
          </div>
        )}
      />
    </Form>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "scan" }];
};
