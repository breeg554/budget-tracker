import React from 'react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { ItemList } from '~/list/ItemList';

interface ReceiptsListProps {
  transactions: GetTransactionDto[];
}

export const ReceiptsList = ({ transactions }: ReceiptsListProps) => {
  return (
    <ItemList
      className="flex flex-col gap-y-2"
      items={transactions}
      renderItem={(item) => <ReceiptsListItem data={item} />}
    />
  );
};

interface ReceiptsListItemProps {
  data: GetTransactionDto;
}

function ReceiptsListItem({ data }: ReceiptsListItemProps) {
  return (
    <article>
      <div>
        <h1>{data.name}</h1>
        <p>{data.date}</p>
      </div>

      <div>
        <p>author: {data.author.email}</p>
      </div>

      <div>{data.items.length} items</div>
    </article>
  );
}
