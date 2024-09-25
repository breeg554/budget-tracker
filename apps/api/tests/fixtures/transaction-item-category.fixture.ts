import { v4 as uuidv4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { DataSource } from 'typeorm';

export class TransactionItemCategoryFixture {
  private _transactionItemCategory: TransactionItemCategory;

  constructor() {
    this._transactionItemCategory = Object.assign(
      new TransactionItemCategory(),
      {
        id: uuidv4(),
        name: 'Alcohol',
        items: [],
      },
    );
  }

  async saveInDB(app: INestApplication) {
    const dataSource = app.get(DataSource);

    const created = await dataSource
      .getRepository(TransactionItemCategory)
      .save(this.category);

    this._transactionItemCategory = Object.assign(
      new TransactionItemCategory(),
      { ...this._transactionItemCategory, ...created },
    );

    return this;
  }

  withName(name: string) {
    this._transactionItemCategory = Object.assign(
      new TransactionItemCategory(),
      { ...this._transactionItemCategory, name },
    );

    return this;
  }

  get category() {
    return this._transactionItemCategory;
  }
}

export const createTransactionItemCategoryFixture = () =>
  new TransactionItemCategoryFixture();
