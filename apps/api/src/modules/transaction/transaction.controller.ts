import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '~/modules/auth/public.decorator';
import { GetTransactionItemCategoryDto } from '~/dtos/transaction/get-transaction-item-category.dto';
import { CreateTransactionItemCategoryDto } from '~/dtos/transaction/create-transaction-item-category.dto';
import { TransactionService } from '~/modules/transaction/transaction.service';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Public()
  getAll(): Promise<GetTransactionDto[]> {
    return this.transactionService.findAll();
  }

  @Post()
  @Public()
  create(@Body() data: CreateTransactionDto): Promise<GetTransactionDto> {
    return this.transactionService.create(data);
  }
}
