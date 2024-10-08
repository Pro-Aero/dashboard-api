import { Controller, Get, Param, Query } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { DateRangeFilter } from './models/graphs.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  @Get('team/availability')
  async calculateAllWorkedHours(@Query() filter: DateRangeFilter) {
    return await this.graphsService.calculateTeamWorkedHours(filter);
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
