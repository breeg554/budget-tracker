import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionService } from '~/modules/transaction/transaction.service';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAll(): Promise<GetTransactionDto[]> {
    return this.transactionService.findAll();
  }

  @Post()
  create(@Body() data: CreateTransactionDto): Promise<GetTransactionDto> {
    return this.transactionService.create(data);
  }
}
