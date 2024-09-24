import { INestApplication } from '@nestjs/common';
import { User } from '~/entities/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { Organization } from '~/entities/organization/organization.entity';

export class TransactionFixture {
  private _transaction: Transaction;

  constructor(
    author: User,
    organization: Organization,
    transaction?: Partial<Transaction>,
  ) {
    this._transaction = {
      id: uuidv4(),
      name: 'Transaction',
      type: TransactionType.PURCHASE,
      items: [],
      organization: organization,
      author: author,
      date: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedDate: null,
      ...transaction,
    };
  }

  async saveInDB(app: INestApplication) {
    const transactionService = app.get(TransactionService);

    const created = await transactionService.create(
      {
        ...this.transaction,
        items: this.transaction.items.map((item) => ({
          ...item,
          transaction: this.transaction.id,
          category: item.category.id,
        })),
      },
      this.transaction.organization.name,
      this.transaction.author.id,
    );

    this._transaction = Object.assign(new Transaction(), {
      ...this._transaction,
      ...created,
    });

    return this;
  }

  get transaction() {
    return this._transaction;
  }
}

export const createTransactionFixture = (
  author: User,
  organization: Organization,
  transaction?: Partial<Transaction>,
) => new TransactionFixture(author, organization, transaction);
