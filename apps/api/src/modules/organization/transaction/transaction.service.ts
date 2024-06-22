import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserService } from '~/modules/organization/user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async create(
    data: CreateTransactionDto,
    organizationName: string,
    userId: string,
  ): Promise<GetTransactionDto> {
    const organization =
      await this.organizationService.ensureUserInOrganization(
        userId,
        organizationName,
      );

    const user = await this.userService.findOne(userId);

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
    const organization =
      await this.organizationService.ensureUserInOrganization(
        userId,
        organizationName,
      );

    const transactions = await this.transactionRepository.find({
      where: { organization: { id: organization.id }, author: { id: userId } },
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
