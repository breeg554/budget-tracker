import { v4 as uuidv4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { TransactionItemCategoryService } from '~/transaction/transaction-item/transaction-item-category/transaction-item-category.service';

export class TransactionItemCategoryFixture {
  private _transactionItemCategory: TransactionItemCategory;

  constructor(category?: Partial<TransactionItemCategory>) {
    this._transactionItemCategory = {
      id: uuidv4(),
      name: 'Alcohol',
      items: [],
      ...category,
    };
  }

  async saveInDB(app: INestApplication) {
    const transactionItemCategoryService = app.get(
      TransactionItemCategoryService,
    );

    const created = await transactionItemCategoryService.create(this.category);

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
