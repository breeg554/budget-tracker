import { useParams } from '@remix-run/react';

export const useTransactionId = () => {
  const params = useParams();

  if (!params.transactionId) {
    throw new Error('Transaction id is required');
  }

  return params.transactionId;
};
