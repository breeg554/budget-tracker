import React from 'react';
import { useFetcher } from '@remix-run/react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { ClientDate } from '~/dates/ClientDate';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '~/dropdowns/Dropdown';
import { useOrganizationName } from '~/hooks/useOrganizationName';
import { TrashIcon } from '~/icons/TrashIcon';
import { Link } from '~/link/Link';
import { ItemList } from '~/list/ItemList';
import { confirm } from '~/modals/confirm';
import { routes } from '~/routes';
import { Skeleton } from '~/ui/skeleton';
import { CustomDate } from '~/utils/CustomDate';
import { TransactionItemCategory } from '~/utils/TransactionItemCategory';

interface ReceiptsListProps {
  transactions: GetTransactionDto[];
}

export const ReceiptsList = ({ transactions }: ReceiptsListProps) => {
  const fetcher = useFetcher();
  const organizationName = useOrganizationName();
  const deleteTransaction = (transactionId: string) => {
    confirm({
      children:
        'You are about to delete this transaction. This action is irreversible.',
      onConfirm: () =>
        fetcher.submit({ id: transactionId }, { method: 'delete' }),
    });
  };
  return (
    <ItemList
      className="flex flex-col gap-y-2"
      items={transactions}
      renderItem={(item) => (
        <Link withQuery to={routes.receipt.getPath(organizationName, item.id)}>
          <ReceiptsListItem data={item} onDelete={deleteTransaction} />
        </Link>
      )}
    />
  );
};

interface ReceiptsListItemProps {
  data: GetTransactionDto;
  onDelete: (id: string) => void;
}

function ReceiptsListItem({ data, onDelete }: ReceiptsListItemProps) {
  const deleteTransaction = () => {
    onDelete(data.id);
  };

  return (
    <article className="border border-input rounded-lg px-3 py-2 flex flex-col gap-2">
      <header className="flex gap-2 justify-between">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">
            <ClientDate
              fallback={<Skeleton className="w-[70px] h-[14px] rounded-xl" />}
            >
              {new CustomDate(data.date).format('dd MMM yyy')}
            </ClientDate>
          </p>
          <h1
            className="text-foreground font-semibold text-base line-clamp-1"
            title={data.name}
          >
            {data.name}
          </h1>
        </div>

        <div className="flex" onClick={(e) => e.preventDefault()}>
          <Dropdown>
            <DropdownTrigger />

            <DropdownContent>
              <DropdownItem
                variant="destructive"
                icon={<TrashIcon />}
                onClick={deleteTransaction}
              >
                Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </header>

      <main>
        <ItemList
          items={data.categories}
          className="flex flex-wrap gap-1 line-clamp-1"
          renderItem={(item) => <CategoryItemBadge data={item} />}
        />
      </main>
    </article>
  );
}

interface CategoryItemBadgeProps {
  data: GetTransactionDto['categories'][0];
}
function CategoryItemBadge({ data }: CategoryItemBadgeProps) {
  const categoryItem = new TransactionItemCategory(data);

  return (
    <p className="text-xs flex gap-1 items-center rounded-full px-1 py-0.5 bg-secondary">
      <span>{categoryItem.icon}</span>

      <span>{categoryItem.name}</span>
    </p>
  );
}
