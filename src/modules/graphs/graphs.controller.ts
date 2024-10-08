import { Controller, Get, Query } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { DateRangeFilter } from './models/graphs.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  @Get('team/availability')
  async calculateAllWorkedHours(@Query() filter: DateRangeFilter) {
    return await this.graphsService.calculateTeamWorkedHours(filter);
  }
}
