import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StatisticsService } from '~/modules/organization/statistics/statistics.service';
import { GetStatisticsByCategoryDto } from '~/dtos/statistics/get-statistics-by-category.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { OrganizationGuard } from '~/modules/guards/organization-guard';

@Controller()
@UseInterceptors(CacheInterceptor)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(OrganizationGuard)
  @Get('categories')
  getAll(
    @Param('name') organizationName: string,
    @Query() query: { startDate: string; endDate: string },
  ): Promise<GetStatisticsByCategoryDto[]> {
    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.statisticsService.getStatisticsByCategory(
      query,
      organizationName,
    );
  }
}
