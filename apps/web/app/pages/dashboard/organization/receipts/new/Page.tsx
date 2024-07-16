import React from "react";
import type { MetaFunction } from "@remix-run/node";
import { IconButton } from "~/buttons/IconButton";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { loader } from "./loader.server";
import { TransactionForm } from "./components/TransactionForm";
import { action } from "./action.server";
import { routes } from "~/routes";
import { useOrganizationName } from "~/utils/useOrganizationName";
import { CrossIcon } from "~/icons/CrossIcon";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { SubmitButton } from "~/form/SubmitButton";
import { NavFloatingWrapper } from "~/dashboard/layout/components/DashboardNav";

export const NewReceiptPage = () => {
  const organizationName = useOrganizationName();
  const navigate = useNavigate();

  const { itemCategories, receipt } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const backToDashboard = () => {
    navigate(routes.organization.getPath(organizationName));
  };

  return (
    <SectionWrapper className="pb-12">
      <IconButton
        onClick={backToDashboard}
        variant="ghost"
        className="absolute top-4 left-4"
      >
        <CrossIcon className="w-5 h-5" />
      </IconButton>

      <TransactionForm
        id="transaction-form"
        lastResult={lastResult}
        itemCategories={itemCategories}
        defaultValue={receipt}
      />

      <Outlet />

      <NavFloatingWrapper>
        <div className="px-4 py-2 flex justify-between">
          <SubmitButton variant="secondary" onClick={backToDashboard}>
            Cancel
          </SubmitButton>

          <SubmitButton type="submit" form="transaction-form">
            Add transaction
          </SubmitButton>
        </div>
      </NavFloatingWrapper>
    </SectionWrapper>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
