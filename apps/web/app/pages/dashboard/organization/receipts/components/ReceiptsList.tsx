import React from 'react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { CategoryCircle } from '~/dashboard/organization/receipts/components/CategoryCircle';
import { useDeleteTransaction } from '~/dashboard/organization/receipts/transactions.hooks';
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
import { routes } from '~/routes';
import { Skeleton } from '~/ui/skeleton';
import { cn } from '~/utils/cn';
import { customDate } from '~/utils/CustomDate';

interface ReceiptsListProps {
  transactions: GetTransactionDto[];
}

export const ReceiptsList = ({ transactions }: ReceiptsListProps) => {
  const { action: deleteTransaction } = useDeleteTransaction();

  const organizationName = useOrganizationName();

  return (
    <ItemList
      className="flex flex-col gap-y-2"
      items={transactions}
      renderItem={(item) => (
        <Link
          withQuery
          to={routes.receipt.getPath(organizationName, item.id)}
          preventScrollReset
        >
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
    <article className="border border-input rounded-xl flex flex-col">
      <header className="flex gap-2 justify-between p-4">
        <div className="flex gap-2 items-center">
          <h1
            className="text-foreground font-semibold text-lg line-clamp-1"
            title={data.name}
          >
            {data.name}
          </h1>
        </div>

        <div className="flex" onClick={(e) => e.preventDefault()}>
          <Dropdown>
            <DropdownTrigger size="xxs" />

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

      <section className="flex flex-col divide-y border-t border-input p-4">
        <ReceiptListItemRow>
          <ReceiptListItemRowName>Total</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.price.formatted}>
            {data.price.formatted}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow>
          <ReceiptListItemRowName>Date</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.date}>
            <ClientDate
              fallback={<Skeleton className="w-[95px] h-4 rounded-xl" />}
            >
              {customDate(data.date).format('dd MMM yyy')}
            </ClientDate>
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow className="col-span-3">
          <ReceiptListItemRowName>Author</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.author.email}>
            {data.author.email}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow>
          <ReceiptListItemRowName>Items</ReceiptListItemRowName>
          <ReceiptListItemRowContent>
            {data.items.length}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow>
          <ReceiptListItemRowName>Categories</ReceiptListItemRowName>
          <ItemList
            items={data.categories}
            className="relative grow flex justify-end -space-x-2 overflow-hidden"
            renderItem={(item) => <CategoryCircle data={item} />}
          >
            <div className="absolute bottom-0 left-0 bg-gradient-to-l from-transparent to-white w-20 h-6 pointer-events-none" />
          </ItemList>
        </ReceiptListItemRow>
      </section>
    </article>
  );
}

function ReceiptListItemRow({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('flex gap-4 py-1 items-center justify-between', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

function ReceiptListItemRowContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <p className={cn('text-foreground truncate text-sm', className)} {...rest}>
      {children}
    </p>
  );
}

function ReceiptListItemRowName({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('text-muted-foreground text-xs shrink-0 w-fit', className)}
      {...rest}
    >
      {children}
    </span>
  );
}
