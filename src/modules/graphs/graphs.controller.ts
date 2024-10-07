import { Controller, Get, Query } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { DateRangeFilter } from './models/graphs.dto';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  @Get()
  async calculateAllWorkedHours(@Query() filter: DateRangeFilter) {
    return await this.graphsService.calculateAllWorkedHours(filter);
    return await this.graphsService.calculateWorkedHours(
      '6c119436-3436-437a-b400-320f4a310204',
      filter,
    );
  }
}
