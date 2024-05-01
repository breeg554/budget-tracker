import type { MetaFunction } from "@remix-run/node";
import { TextInput } from "~/inputs/TextInput";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "~/buttons/IconButton";
import { useHistoryBack } from "~/hooks/useHistoryBack";
import { useActionData, useLoaderData } from "@remix-run/react";
import { loader } from "./loader.server";
import { ValidatedForm } from "~/form/ValidatedForm";
import { TransactionForm } from "~/dashboard/receipts/new/components/TransactionForm";
import { action } from "./action.server";

export const NewReceiptPage = () => {
  const { itemCategories } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const { goBack } = useHistoryBack();

  return (
    <main className="relative">
      <IconButton
        onClick={goBack}
        variant="ghost"
        size="3"
        className="absolute top-4 left-4"
      >
        <Cross1Icon width={20} height={20} />
      </IconButton>

      <TransactionForm lastResult={lastResult} />
    </main>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
