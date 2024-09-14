import { Controller, Delete, Get, Param } from '@nestjs/common';

import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { GetTransactionItemDto } from '~/dtos/transaction/get-transaction-item.dto';
import { TransactionItemService } from '~/modules/organization/transaction/transaction-item/transaction-item.service';

@Controller()
export class TransactionItemController {
  constructor(
    private readonly transactionItemService: TransactionItemService,
  ) {}

  @Get(':id')
  getItem(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<GetTransactionItemDto> {
    return this.transactionItemService.findOneByTransactionId(
      id,
      transactionId,
      organizationName,
      user.id,
    );
  }
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
  ): Promise<void> {
    return this.transactionItemService.delete(
      id,
      transactionId,
      organizationName,
      user.id,
    );
  }
}
