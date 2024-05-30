import React from "react";
import type { MetaFunction } from "@remix-run/node";
import { Cross1Icon } from "@radix-ui/react-icons";
import { IconButton } from "~/buttons/IconButton";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import { loader } from "./loader.server";
import { TransactionForm } from "~/dashboard/receipts/new/components/TransactionForm";
import { action } from "./action.server";
import { Dialog } from "@radix-ui/themes";
import { routes } from "~/routes";

export const NewReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { itemCategories, recipe } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const isOpen = location.pathname === routes.scanReceipt.getPath();
  const onClose = () => {
    navigate(routes.newReceipt.getPath());
  };

  const backToDashboard = () => {
    navigate(routes.dashboard.getPath());
  };

  return (
    <main className="relative">
      <IconButton
        onClick={backToDashboard}
        variant="ghost"
        size="3"
        className="absolute top-4 left-4"
      >
        <Cross1Icon width={20} height={20} />
      </IconButton>

      <TransactionForm
        lastResult={lastResult}
        itemCategories={itemCategories}
        defaultValue={recipe}
      />

      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content className="max-w-xl w-full">
          <Dialog.Title>Take or upload photo</Dialog.Title>

          <Outlet />
        </Dialog.Content>
      </Dialog.Root>
    </main>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
