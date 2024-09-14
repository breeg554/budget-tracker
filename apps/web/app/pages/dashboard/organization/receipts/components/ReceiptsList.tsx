import React from 'react';

import { GetTransactionDto } from '~/api/Transaction/transactionApi.types';
import { CategoryBadge } from '~/dashboard/organization/receipts/components/CategoryBadge';
import { useDeleteReceipt } from '~/dashboard/organization/receipts/receipts.hooks';
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
import { CustomDate } from '~/utils/CustomDate';

interface ReceiptsListProps {
  transactions: GetTransactionDto[];
}

export const ReceiptsList = ({ transactions }: ReceiptsListProps) => {
  const { action: deleteTransaction } = useDeleteReceipt();

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
    <article className="border border-input rounded-xl p-4 flex flex-col gap-3">
      <header className="flex gap-2 justify-between">
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

      <main className="grid grid-cols-[2fr_3fr_4fr] gap-1">
        <ReceiptListItemRow>
          <ReceiptListItemRowName>Items</ReceiptListItemRowName>
          <ReceiptListItemRowContent>
            {data.items.length}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow>
          <ReceiptListItemRowName>Date</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.date}>
            <ClientDate
              fallback={<Skeleton className="w-[95px] h-4 rounded-xl" />}
            >
              {new CustomDate(data.date).format('dd MMM yyy')}
            </ClientDate>
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow>
          <ReceiptListItemRowName>Total</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.price.formatted}>
            {data.price.formatted}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ReceiptListItemRow className="col-span-3">
          <ReceiptListItemRowName>Author</ReceiptListItemRowName>
          <ReceiptListItemRowContent title={data.author.email}>
            {data.author.email}
          </ReceiptListItemRowContent>
        </ReceiptListItemRow>

        <ItemList
          items={data.categories}
          className="flex flex-wrap gap-1 pt-3 col-span-3"
          renderItem={(item) => <CategoryBadge data={item} />}
        />
      </main>
    </article>
  );
}

function ReceiptListItemRow({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn('flex flex-col', className)} {...rest}>
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
      className={cn('text-muted-foreground text-xs shrink-0', className)}
      {...rest}
    >
      {children}
    </span>
  );
}
