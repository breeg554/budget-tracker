import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';

import { TransactionItemCategoryController } from './transaction-item-category.controller';
import { TransactionItemCategoryService } from './transaction-item-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItemCategory])],
  controllers: [TransactionItemCategoryController],
  providers: [TransactionItemCategoryService],
})
export class TransactionItemCategoryModule {}
