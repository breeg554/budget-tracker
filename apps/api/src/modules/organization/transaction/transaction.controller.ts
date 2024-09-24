import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UpdateTransactionDto } from '~/dtos/transaction/update-transaction.dto';
import { OrganizationGuard } from '~/modules/guards/organization-guard';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(OrganizationGuard)
  getAll(
    @Param('name') organizationName: string,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<GetTransactionDto>> {
    return this.transactionService.findAll(query, organizationName);
  }

  @Get(':id')
  @UseGuards(OrganizationGuard)
  getOne(@Param('id') id: string): Promise<GetTransactionDto> {
    return this.transactionService.findOne(id);
  }

  @Post()
  @UseGuards(OrganizationGuard)
  create(
    @Body() data: CreateTransactionDto,
    @Param('name') organizationName: string,
    @User() user: AuthUser,
  ): Promise<GetTransactionDto> {
    return this.transactionService.create(data, organizationName, user.id);
  }

  @Delete(':id')
  @UseGuards(OrganizationGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.transactionService.delete(id);
  }

  @Put(':id')
  @UseGuards(OrganizationGuard)
  update(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
  ): Promise<GetTransactionDto> {
    return this.transactionService.update(data, id);
  }
}
