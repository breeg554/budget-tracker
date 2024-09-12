import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

@Injectable()
export class TransactionItemService {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
  ) {}

  findAllByTransactionId(transactionId: string): Promise<TransactionItem[]> {
    return this.transactionItemRepository.find({
      where: { transaction: { id: transactionId } },
    });
  }

  async findOneByTransactionId(
    transactionId: string,
    id: string,
  ): Promise<TransactionItem> {
    const transactionItem = await this.transactionItemRepository.findOne({
      where: { transaction: { id: transactionId }, id },
    });

    if (!transactionItem) {
      throw new NotFoundException('Transaction item not found');
    }

    return transactionItem;
  }
}
