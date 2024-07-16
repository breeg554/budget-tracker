import type { MetaFunction } from '@remix-run/node';

export const ReceiptsPage = () => {
  return <p>Receipts</p>;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Receipts' }];
};
