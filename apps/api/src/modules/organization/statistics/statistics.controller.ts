import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { AuthUser, User } from '~/modules/auth/decorators/user.decorator';
import { StatisticsService } from '~/modules/organization/statistics/statistics.service';
import { GetStatisticsByCategoryDto } from '~/dtos/statistics/get-statistics-by-category.dto';

@Controller('/organizations/:organizationName/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('categories')
  getAll(
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
    @Query() query: { startDate: string; endDate: string },
  ): Promise<GetStatisticsByCategoryDto[]> {
    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.statisticsService.getStatisticsByCategory(
      query,
      organizationName,
      user.id,
    );
  }
}
