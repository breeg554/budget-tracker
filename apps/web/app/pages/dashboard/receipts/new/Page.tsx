import type { MetaFunction } from "@remix-run/node";

export const NewReceiptPage = () => {
  return <p>New Receipt</p>;
};

export const meta: MetaFunction = () => {
  return [{ title: "New Receipt" }];
};
