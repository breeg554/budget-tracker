import { INestApplication } from '@nestjs/common';
import { User } from '~/entities/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { Organization } from '~/entities/organization/organization.entity';
import { DataSource } from 'typeorm';

export class TransactionFixture {
  private _transaction: Transaction;

  constructor(author: User, organization: Organization) {
    this._transaction = Object.assign(new Transaction(), {
      id: uuidv4(),
      author: author,
      items: [],
      organization: organization,
      name: 'Sample Transaction',
      type: TransactionType.PURCHASE,
      date: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedDate: null,
    });
  }

  async saveInDB(app: INestApplication) {
    const dataSource = app.get(DataSource);

    const created = await dataSource
      .getRepository(Transaction)
      .save(this.transaction);

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
) => new TransactionFixture(author, organization);
