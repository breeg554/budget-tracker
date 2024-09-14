import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UpdateTransactionDto } from '~/dtos/transaction/update-transaction.dto';

@Controller()
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

  @Get(':id')
  getOne(
    @Param('id') id: string,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<GetTransactionDto> {
    return this.transactionService.findOne(id, organizationName, user.id);
  }

  @Post()
  create(
    @Body() data: CreateTransactionDto,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<GetTransactionDto> {
    return this.transactionService.create(data, organizationName, user.id);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<void> {
    return this.transactionService.delete(id, organizationName, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
    @Body() data: UpdateTransactionDto,
  ): Promise<GetTransactionDto> {
    return this.transactionService.update(data, id, organizationName, user.id);
  }
}
