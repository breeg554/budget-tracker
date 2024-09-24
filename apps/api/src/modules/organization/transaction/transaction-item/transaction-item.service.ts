import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { CreateTransactionItemDto } from '~/dtos/transaction/create-transaction-item.dto';
import { TransactionItemCategoryService } from './transaction-item-category/transaction-item-category.service';

@Injectable()
export class TransactionItemService {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    private readonly transactionService: TransactionService,
    private readonly transactionItemCategoryService: TransactionItemCategoryService,
  ) {}

  async findOneByTransactionId(
    id: string,
    transactionId: string,
  ): Promise<TransactionItem> {
    const transaction = await this.transactionService.findOne(transactionId);

    const transactionItem = await this.transactionItemRepository.findOne({
      where: { transaction: { id: transaction.id }, id },
    });

    if (!transactionItem) {
      throw new NotFoundException('Transaction item not found');
    }

    return transactionItem;
  }

  async delete(id: string, transactionId: string): Promise<void> {
    const transactionItem = await this.findOneByTransactionId(
      id,
      transactionId,
    );

    try {
      await this.transactionItemRepository.softRemove(transactionItem);
    } catch (err) {
      throw new BadRequestException('Could not delete transaction item', {
        cause: err,
      });
    }
  }

  async create(transactionId: string, data: CreateTransactionItemDto) {
    const item = this.transactionItemRepository.create();

    const category = await this.transactionItemCategoryService.findOne(
      data.category,
    );
    const transaction = await this.transactionService.findById(transactionId);

    item.name = data.name;
    item.type = data.type;
    item.price = data.price;
    item.quantity = data.quantity;
    item.category = category;
    item.transaction = transaction;

    return this.transactionItemRepository.save(item);
  }
}
