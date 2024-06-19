import type { MetaFunction } from "@remix-run/node";

export const OrganizationNew = () => {
  return <p>New</p>;
};

export const meta: MetaFunction = () => {
  return [{ title: "New Organizations" }];
};
