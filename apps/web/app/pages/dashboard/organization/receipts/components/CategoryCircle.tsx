import React from 'react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { Category } from '~/utils/Category';

interface CategoryCircleProps {
  data: GetTransactionDto['categories'][0];
}
export function CategoryCircle({ data }: CategoryCircleProps) {
  const categoryItem = new Category(data);

  return (
    <p
      className="w-6 h-6 rounded-full border border-input text-xs flex justify-center items-center bg-white"
      aria-label={categoryItem.name}
    >
      {categoryItem.icon}
    </p>
  );
}
