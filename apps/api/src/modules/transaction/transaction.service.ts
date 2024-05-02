import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<GetTransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['items'],
    });

    return this.toGetTransactionDto(transactions);
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.type = data.type;
    transaction.name = data.name;
    transaction.date = data.date;

    transaction.items = data.items.map((itemDto) => {
      const item = new TransactionItem();

      item.name = itemDto.name;
      item.amount = itemDto.amount;
      item.value = itemDto.value;
      item.type = itemDto.type;
      item.category = { id: itemDto.category } as TransactionItemCategory;

      return item;
    });

    return this.transactionRepository.save(transaction);
  }

  private toGetTransactionDto(
    transactions: Transaction[],
  ): GetTransactionDto[] {
    return transactions.map((transaction) => ({
      ...transaction,
      value: transaction.items.reduce(
        (curr, item) => curr + Number(item.value) * Number(item.amount),
        0,
      ),
    }));
  }
}
