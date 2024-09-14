import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';

@Injectable()
export class TransactionItemService {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    private readonly transactionService: TransactionService,
  ) {}

  async findOneByTransactionId(
    id: string,
    transactionId: string,
    organizationName: string,
    userId: string,
  ): Promise<TransactionItem> {
    const transaction = await this.transactionService.findOne(
      transactionId,
      organizationName,
      userId,
    );

    const transactionItem = await this.transactionItemRepository.findOne({
      where: { transaction: { id: transaction.id }, id },
    });

    if (!transactionItem) {
      throw new NotFoundException('Transaction item not found');
    }

    return transactionItem;
  }

  async delete(
    id: string,
    transactionId: string,
    organizationName: string,
    userId: string,
  ): Promise<void> {
    const transactionItem = await this.findOneByTransactionId(
      id,
      transactionId,
      organizationName,
      userId,
    );

    try {
      await this.transactionItemRepository.softRemove(transactionItem);
    } catch (err) {
      throw new BadRequestException('Could not delete transaction item', {
        cause: err,
      });
    }
  }
}
