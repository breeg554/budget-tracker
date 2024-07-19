import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreateTransactionItemCategoryDto } from '~/dtos/transaction/create-transaction-item-category.dto';
import { GetTransactionItemCategoryDto } from '~/dtos/transaction/get-transaction-item-category.dto';
import { Public } from '~/modules/auth/public.decorator';

import { TransactionItemCategoryService } from './transaction-item-category.service';

@Controller('transaction-item-categories')
export class TransactionItemCategoryController {
  constructor(
    private readonly transactionItemCategoryService: TransactionItemCategoryService,
  ) {}

  @Public()
  @Get()
  getAll(): Promise<GetTransactionItemCategoryDto[]> {
    return this.transactionItemCategoryService.findAll();
  }

  @Public()
  @Post()
  create(
    @Body() data: CreateTransactionItemCategoryDto,
  ): Promise<GetTransactionItemCategoryDto> {
    return this.transactionItemCategoryService.create(data);
  }

  @Public()
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.transactionItemCategoryService.deleteById(id);
  }
}
