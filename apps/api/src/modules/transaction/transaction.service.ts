import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);

    return this.transactionRepository.save(transaction);
  }
}
