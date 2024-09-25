import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class TransactionItemFixture {
  private _transactionItem: TransactionItem;

  constructor(category: TransactionItemCategory, transaction: Transaction) {
    this._transactionItem = Object.assign(new TransactionItem(), {
      id: uuidv4(),
      price: 12,
      quantity: 1,
      name: 'TransactionItem',
      type: TransactionItemType.OUTCOME,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: category,
      transaction: transaction,
      deletedDate: null,
    });
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

  withName(name: string) {
    this._transactionItem = Object.assign(new TransactionItem(), {
      ...this._transactionItem,
      name,
    });

    return this;
  }

  withPrice(price: number) {
    this._transactionItem = Object.assign(new TransactionItem(), {
      ...this._transactionItem,
      price,
    });

    return this;
  }

  withQuantity(quantity: number) {
    this._transactionItem = Object.assign(new TransactionItem(), {
      ...this._transactionItem,
      quantity,
    });

    return this;
  }

  get item() {
    return this._transactionItem;
  }
}

export const createTransactionItemFixture = (
  category: TransactionItemCategory,
  transaction: Transaction,
) => new TransactionItemFixture(category, transaction);
