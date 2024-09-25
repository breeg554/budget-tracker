import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class TransactionItemFixture {
  private _transactionItem: TransactionItem;

  constructor(
    category: TransactionItemCategory,
    transaction: Transaction,
    transactionItem?: Partial<TransactionItem>,
  ) {
    this._transactionItem = Object.assign(new TransactionItem(), {
      id: uuidv4(),
      name: 'TransactionItem',
      quantity: 1,
      price: 12,
      type: TransactionItemType.OUTCOME,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: category,
      transaction: transaction,
      deletedDate: null,
      ...transactionItem,
    });
  }

  get item() {
    return this._transactionItem;
  }

  async saveInDB(app: INestApplication) {
    const dataSource = app.get(DataSource);

    const created = await dataSource
      .getRepository(TransactionItem)
      .save(this.item);

    this._transactionItem = Object.assign(new Transaction(), {
      ...this._transactionItem,
      ...created,
    });

    return this;
  }
}

export const createTransactionItemFixture = (
  category: TransactionItemCategory,
  transaction: Transaction,
  transactionItem?: Partial<TransactionItem>,
) => new TransactionItemFixture(category, transaction, transactionItem);
