import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '~/entities/transaction/transaction.entity';
import { OrganizationService } from '~/modules/organization/organization.service';
import { GetStatisticsByCategoryDto } from '~/dtos/statistics/get-statistics-by-category.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly organizationService: OrganizationService,
  ) {}

  async getStatisticsByCategory(
    query: { startDate: string; endDate: string },
    organizationName: string,
    userId: string,
  ): Promise<GetStatisticsByCategoryDto[]> {
    const organization =
      await this.organizationService.ensureUserInOrganization(
        userId,
        organizationName,
      );

    return await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.items', 'items')
      .leftJoin('items.category', 'category')
      .where('transaction.organizationId = :organizationId', {
        organizationId: organization.id,
      })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      })
      .select('category.name', 'name')
      .addSelect('category.id', 'id')
      .addSelect('SUM(items.price * items.quantity)', 'total')
      .groupBy('category.name')
      .addGroupBy('category.id')
      .getRawMany();
  }
}
