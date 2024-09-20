import React from 'react';

import { GetTransactionItemDto } from '~/api/Transaction/transactionApi.types';
import { Category } from '~/utils/Category';

interface TransactionItemListItemProps {
  item: GetTransactionItemDto;
}

export function TransactionItemListItem({
  item,
}: TransactionItemListItemProps) {
  return (
    <article className="flex gap-2 justify-between items-center">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl text-xl bg-neutral-100 flex justify-center items-center shrink-0">
          {new Category(item.category).icon}
        </div>

        <div className="flex flex-col">
          <h4 className="text-foreground line-clamp-1" title={item.name}>
            {item.price.quantity} x {item.name}
          </h4>
          <p className="text-sm text-muted-foreground">{item.category.name}</p>
        </div>
      </header>

      <p className="text-foreground font-medium">
        {item.type === 'outcome' && '-'}
        {item.price.total.formatted}
      </p>
    </article>
  );
}
