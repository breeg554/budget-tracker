import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '~/modules/auth/public.decorator';
import { GetTransactionItemCategoryDto } from '~/dtos/transaction/get-transaction-item-category.dto';
import { CreateTransactionItemCategoryDto } from '~/dtos/transaction/create-transaction-item-category.dto';
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

  @Post()
  @Public()
  create(
    @Body() data: CreateTransactionItemCategoryDto,
  ): Promise<GetTransactionItemCategoryDto> {
    return this.transactionItemCategoryService.create(data);
  }
}
