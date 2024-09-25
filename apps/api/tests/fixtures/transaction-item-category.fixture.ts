import { v4 as uuidv4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { DataSource } from 'typeorm';

export class TransactionItemCategoryFixture {
  private _transactionItemCategory: TransactionItemCategory;

  constructor(category?: Partial<TransactionItemCategory>) {
    this._transactionItemCategory = Object.assign(
      new TransactionItemCategory(),
      {
        id: uuidv4(),
        name: 'Alcohol',
        items: [],
        ...category,
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

  get category() {
    return this._transactionItemCategory;
  }
}

export const createTransactionItemCategoryFixture = (
  category?: Partial<TransactionItemCategory>,
) => new TransactionItemCategoryFixture(category);
