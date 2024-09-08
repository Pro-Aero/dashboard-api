import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PlannerFilter } from './models/planner.dto';
import { PlannersService } from './planners.service';

@Controller('planners')
export class PlannersController {
  constructor(private readonly plannersService: PlannersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PlannerFilter) {
    return await this.plannersService.findAll(filter);
  }

  @Get(':plannerId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('plannerId') plannerId: string) {
    return await this.plannersService.findById(plannerId);
  }
}
