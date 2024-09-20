import React from 'react';

import { GetTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { Category } from '~/utils/Category';

interface CategoryBadgeProps {
  data: GetTransactionItemDto['category'];
}
export function CategoryBadge({ data }: CategoryBadgeProps) {
  const categoryItem = new Category(data);

  return (
    <p className="text-xs flex gap-1 items-center rounded-full px-1 py-0.5 bg-secondary">
      <span>{categoryItem.icon}</span>

      <span>{categoryItem.name}</span>
    </p>
  );
}
