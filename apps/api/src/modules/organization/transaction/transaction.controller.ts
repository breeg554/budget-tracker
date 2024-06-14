import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { CreateTransactionDto } from '~/dtos/transaction/create-transaction.dto';
import { GetTransactionDto } from '~/dtos/transaction/get-transaction.dto';
import { User } from '~/modules/auth/decorators/user.decorator';
import { GetUserDto } from '~/dtos/users/get-user.dto';

@Controller('organizations/:organizationId/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAll(
    @Param('organizationId') organizationId: string,
    @User() user: GetUserDto,
  ): Promise<GetTransactionDto[]> {
    return this.transactionService.findAll(organizationId, user.id);
  }

  @Post()
  create(
    @Body() data: CreateTransactionDto,
    @Param('organizationId') organizationId: string,
    @User() user: GetUserDto,
  ): Promise<GetTransactionDto> {
    return this.transactionService.create(data, organizationId, user.id);
  }
}
