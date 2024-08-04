import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { AuthUser, User } from '~/modules/auth/decorators/user.decorator';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('/organizations/:organizationName/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAll(
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<GetTransactionDto>> {
    return this.transactionService.findAll(query, organizationName, user.id);
  }

  @Post()
  create(
    @Body() data: CreateTransactionDto,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<GetTransactionDto> {
    return this.transactionService.create(data, organizationName, user.id);
  }
}
