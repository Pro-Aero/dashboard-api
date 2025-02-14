import { Controller, Get, Param, Query } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { DateRangeFilter, UserWeekAvailableDto } from './models/graphs.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  @Get('team/availability-old')
  async calculateAllWorkedHours(@Query() filter: DateRangeFilter) {
    return await this.graphsService.calculateTeamWorkedHours(filter);
  }

  @Get('team/availability')
  async teamWorkedGraph(@Query() filter: DateRangeFilter) {
    return await this.graphsService.calculateTeamWorkedGraph(filter);
  }

  @Get('users/:userId/availability/week')
  async calculateWeekAvailable(
    @Param('userId') userId: string,
  ): Promise<UserWeekAvailableDto> {
    return await this.graphsService.calculateWeekAvailable(userId);
  }

  @Get('tasks/user/:userId')
  async calculateTasksAndWorkedHours(
    @Param('userId') userId: string,
    @Query() filter: DateRangeFilter,
  ) {
    return await this.graphsService.calculateTasksAndWorkedHours(
      userId,
      filter,
    );
  }
}
