import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionItemCategoryDto } from '~/dtos/transaction/create-transaction-item-category.dto';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';

@Injectable()
export class TransactionItemCategoryService {
  constructor(
    @InjectRepository(TransactionItemCategory)
    private readonly transactionItemCategoryRepository: Repository<TransactionItemCategory>,
  ) {}

  async findAll(): Promise<TransactionItemCategory[]> {
    return this.transactionItemCategoryRepository.find();
  }

  async create(
    data: CreateTransactionItemCategoryDto,
  ): Promise<TransactionItemCategory> {
    const category = this.transactionItemCategoryRepository.create(data);

    return this.transactionItemCategoryRepository.save(category);
  }
}
