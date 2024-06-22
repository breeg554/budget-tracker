import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { Organization } from '~/entities/organization/organization.entity';
import { User } from '~/entities/user/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: CreateTransactionDto,
    organizationName: string,
    userId: string,
  ): Promise<GetTransactionDto> {
    const organization = await this.organizationRepository.findOne({
      where: { name: organizationName },
      relations: ['users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !organization.users.some((orgUser) => orgUser.id === userId)) {
      throw new NotFoundException(`Organization not found`);
    }

    const transaction = new Transaction();
    transaction.type = data.type;
    transaction.name = data.name;
    transaction.date = data.date;
    transaction.organization = organization;
    transaction.author = user;

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

  async findAllByName(
    organizationName: string,
    userId: string,
  ): Promise<GetTransactionDto[]> {
    const organization = await this.organizationRepository.findOne({
      where: { name: organizationName },
      relations: ['users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !organization.users.some((orgUser) => orgUser.id === userId)) {
      throw new NotFoundException(`Organization not found`);
    }

    const transactions = await this.transactionRepository.find({
      where: { organization: { id: organization.id }, author: { id: user.id } },
      relations: ['items', 'author'],
    });

    return this.toGetTransactionDto(transactions);
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
