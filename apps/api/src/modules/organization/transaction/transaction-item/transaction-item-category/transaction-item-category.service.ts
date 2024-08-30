import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<TransactionItemCategory> {
    const category = await this.transactionItemCategoryRepository.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async create(
    data: CreateTransactionItemCategoryDto,
  ): Promise<TransactionItemCategory> {
    const category = this.transactionItemCategoryRepository.create(data);

    return this.transactionItemCategoryRepository.save(category);
  }

  async deleteById(id: string): Promise<void> {
    const category = await this.findOne(id);

    if (!category) throw new NotFoundException('Category not found');

    await this.transactionItemCategoryRepository.delete(category);
  }
}
