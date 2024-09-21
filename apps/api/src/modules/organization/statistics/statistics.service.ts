import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { addWeeks, addMonths, differenceInDays } from 'date-fns';
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
      .andWhere(
        'transaction.date BETWEEN :startDate AND :endDate OR transaction.date BETWEEN :prevStartDate AND :prevEndDate',
        this.withPreviousPeriod(query),
      )
      .select('category.name', 'name')
      .addSelect('category.id', 'id')
      .addSelect(
        'SUM(CASE WHEN transaction.date BETWEEN :startDate AND :endDate THEN items.price * items.quantity ELSE 0 END)',
        'total',
      )
      .addSelect(
        'SUM(CASE WHEN transaction.date BETWEEN :prevStartDate AND :prevEndDate THEN items.price * items.quantity ELSE 0 END)',
        'prevTotal',
      )
      .groupBy('category.name')
      .addGroupBy('category.id')
      .setParameters(this.withPreviousPeriod(query))
      .getRawMany();
  }

  private withPreviousPeriod(query: { startDate: string; endDate: string }) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (differenceInDays(endDate, startDate) <= 7) {
      return {
        startDate,
        endDate,
        prevStartDate: addWeeks(startDate, -1),
        prevEndDate: addWeeks(endDate, -1),
      };
    } else {
      return {
        startDate,
        endDate,
        prevStartDate: addMonths(startDate, -1),
        prevEndDate: addMonths(endDate, -1),
      };
    }
  }
}
