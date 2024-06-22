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
import { TransactionForm } from "./components/TransactionForm";
import { action } from "./action.server";
import { routes } from "~/routes";
import { useOrganizationName } from "~/utils/useOrganizationName";

export const NewReceiptPage = () => {
  const organizationName = useOrganizationName();
  const location = useLocation();
  const navigate = useNavigate();

  const { itemCategories, receipt } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const isOpen =
    location.pathname === routes.scanReceipt.getPath(organizationName);
  const onClose = () => {
    navigate(routes.newReceipt.getPath(organizationName));
  };

  const backToDashboard = () => {
    navigate(routes.organization.getPath(organizationName));
  };

  return (
    <>
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
        defaultValue={receipt}
      />

      <Outlet />
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
