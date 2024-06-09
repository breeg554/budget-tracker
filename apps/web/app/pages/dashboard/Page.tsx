import type { MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { routes } from "~/routes";
import { loader } from "./loader.server";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { GetTransactionItemDto } from "~/api/Transaction/transactionApi.types";
import { TransactionItemList } from "~/dashboard/components/TransactionItemList";
import groupBy from "lodash.groupby";
import dayjs from "dayjs";

export const DashboardPage = () => {
  const { transactions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const onLogout = () => {
    fetcher.submit(null, { action: routes.signOut.getPath(), method: "post" });
  };

  const days = groupBy(transactions, ({ date }) =>
    dayjs(date).format("DD MMMM"),
  );

  return (
    <>
      <button onClick={onLogout}>Logout</button>

      <SectionWrapper className="mb-6 mt-10 flex gap-2 items-center justify-between">
        <h1 className="text-4xl text-neutral-900">
          <span className="block">Hello,</span>{" "}
          <span className="block font-bold">Dawid</span>
        </h1>

        <button className="rounded-full border border-neutral-150 w-12 h-12 bg-transparent flex justify-center items-center">
          <MagnifyingGlassIcon width={20} height={20} />
        </button>
      </SectionWrapper>

      <SectionWrapper className="mb-6">
        <div className="bg-primary-900 w-full h-[200px] rounded-3xl" />
      </SectionWrapper>

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center mb-2">
          <h2 className="text-neutral-900">Spending</h2>

          <p>select</p>
        </header>

        <div className="pb-20">
          <TransactionItemList items={days} />
        </div>
      </SectionWrapper>
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};
