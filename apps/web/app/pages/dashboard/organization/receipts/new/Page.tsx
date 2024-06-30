import React from "react";
import type { MetaFunction } from "@remix-run/node";
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
import { CrossIcon } from "~/icons/CrossIcon";

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
        className="absolute top-4 left-4"
      >
        <CrossIcon className="w-5 h-5" />
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
