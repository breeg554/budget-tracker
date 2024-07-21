import React, { useMemo } from 'react';

import {
  GetTransactionDto,
  GetTransactionItemDto,
} from '~/api/Transaction/transactionApi.types';
import { ItemList } from '~/list/ItemList';
import { MonetaryValue } from '~/utils/MonetaryValue';
import { TransactionItemCategory } from '~/utils/TransactionItemCategory';

interface TransactionItemListProps {
  items: Record<string, GetTransactionDto[]>;
}

export const TransactionItemList: React.FC<TransactionItemListProps> = ({
  items,
}) => {
  const days = useMemo(() => {
    return Object.keys(items)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((day) => ({
        day,
        id: day,
        items: items[day].reduce(
          (curr, transaction) => [...curr, ...transaction.items],
          [] as GetTransactionItemDto[],
        ),
      }));
  }, [items]);

  return (
    <ItemList
      items={days}
      className="grid grid-cols-1 gap-2"
      renderItem={(item) => <TransactionItemListGroup group={item} />}
    />
  );
};

interface TransactionItemListGroupProps {
  group: { day: string; items: GetTransactionItemDto[] };
}

function TransactionItemListGroup({ group }: TransactionItemListGroupProps) {
  return (
    <div>
      <p className="text-muted-foreground text-sm pt-3 pb-2">{group.day}</p>
      <ItemList
        items={group.items}
        className="grid grid-cols-1 gap-2"
        renderItem={(item) => <TransactionItemListItem item={item} />}
      />
    </div>
  );
}

interface TransactionItemListItemProps {
  item: GetTransactionItemDto;
}

export function TransactionItemListItem({
  item,
}: TransactionItemListItemProps) {
  return (
    <article className="flex gap-2 justify-between items-center">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl text-xl bg-neutral-100 flex justify-center items-center">
          {new TransactionItemCategory(item.category).icon}
        </div>

        <div className="flex flex-col">
          <h4 className="text-foreground font-medium">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.category.name}</p>
        </div>
      </header>

      <p className="text-foreground font-medium">
        {item.type === 'outcome' && '-'}
        {new MonetaryValue(item.price, item.quantity).withCurrency()}
      </p>
    </article>
  );
}
