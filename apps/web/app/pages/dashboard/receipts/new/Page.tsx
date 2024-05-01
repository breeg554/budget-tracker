import type { MetaFunction } from "@remix-run/node";
import { TextInput } from "~/inputs/TextInput";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { IconButton } from "~/buttons/IconButton";
import { useHistoryBack } from "~/hooks/useHistoryBack";
import { useLoaderData } from "@remix-run/react";
import { loader } from "./loader.server";

export const NewReceiptPage = () => {
  const { itemCategories } = useLoaderData<typeof loader>();
  const { goBack } = useHistoryBack();

  console.log(itemCategories);

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

      <SectionWrapper className="pb-8 pt-14">
        <h1 className="text-5xl font-bold w-full text-center">
          {22.12}
          <span className="text-xl">$</span>
        </h1>

        <div className="w-full flex flex-col gap-2 mt-6">
          <TextInput type="date" />

          <TextInput placeholder="name..." />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <header className="flex justify-between gap-2 items-center">
          <h2>Items</h2>

          <IconButton variant="surface" size="1">
            <PlusIcon />
          </IconButton>
        </header>

        <ul className="flex flex-col gap-2 py-4">
          <li className="bg-neutral-50 rounded p-2 text-sm text-neutral-800 border border-neutral-150 flex gap-1 items-center">
            <PlusIcon />
            <span>Add new item</span>
          </li>
        </ul>
      </SectionWrapper>
    </main>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
