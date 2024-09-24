import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserService } from '~/modules/user/user.service';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { UpdateTransactionDto } from '~/dtos/transaction/update-transaction.dto';

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
  ): Promise<Transaction> {
    const organization =
      await this.organizationService.findByName(organizationName);

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
      item.quantity = itemDto.quantity;
      item.price = itemDto.price;
      item.type = itemDto.type;
      item.category = { id: itemDto.category } as TransactionItemCategory;

      return item;
    });

    return this.transactionRepository.save(transaction);
  }

  async delete(transactionId: string): Promise<void> {
    const transaction = await this.findOne(transactionId);

    try {
      await this.transactionRepository.softRemove(transaction);
    } catch (err) {
      throw new BadRequestException('Could not delete transaction', {
        cause: err,
      });
    }
  }

  async update(
    data: UpdateTransactionDto,
    transactionId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(transactionId);

    try {
      return await this.transactionRepository.save({ ...transaction, ...data });
    } catch (err) {
      throw new BadRequestException('Could not delete transaction', {
        cause: err,
      });
    }
  }

  async findById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findOne(transactionId: string): Promise<GetTransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['items', 'author'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.toGetTransactionDto(transaction);
  }

  async findAll(
    query: PaginateQuery,
    organizationName: string,
  ): Promise<Paginated<GetTransactionDto>> {
    const organization =
      await this.organizationService.findByName(organizationName);

    const { data, ...rest } = await paginate(
      query,
      this.transactionRepository,
      {
        where: { organization: { id: organization.id } },
        relations: ['items', 'author', 'items.category'],
        sortableColumns: ['date', 'id', 'name'],
        defaultSortBy: [['date', 'DESC']],
        searchableColumns: ['name'],
        filterableColumns: {
          date: [FilterOperator.BTW],
          'items.category.id': [FilterOperator.IN],
          'author.id': [FilterOperator.IN],
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return { ...rest, data: data.map(this.toGetTransactionDto) };
  }

  private toGetTransactionDto(transaction: Transaction): GetTransactionDto {
    return {
      ...transaction,
      author: {
        email: transaction.author.email,
        id: transaction.author.id,
      },
      price: transaction.items.reduce(
        (curr, item) => curr + Number(item.price) * Number(item.quantity),
        0,
      ),
    };
  }
}
