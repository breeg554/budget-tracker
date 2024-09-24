import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { GetTransactionItemDto } from '~/dtos/transaction/get-transaction-item.dto';
import { TransactionItemService } from '~/modules/organization/transaction/transaction-item/transaction-item.service';
import { OrganizationGuard } from '~/modules/guards/organization-guard';

@Controller()
export class TransactionItemController {
  constructor(
    private readonly transactionItemService: TransactionItemService,
  ) {}

  @UseGuards(OrganizationGuard)
  @Get(':id')
  getItem(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
  ): Promise<GetTransactionItemDto> {
    return this.transactionItemService.findOneByTransactionId(
      id,
      transactionId,
    );
  }

  @UseGuards(OrganizationGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Param('transactionId') transactionId: string,
  ): Promise<void> {
    return this.transactionItemService.delete(id, transactionId);
  }
}
