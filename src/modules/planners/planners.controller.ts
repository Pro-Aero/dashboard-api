import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { TaskFilter } from '../tasks/models/task.dto';
import { TasksService } from '../tasks/tasks.service';
import { PlannerFilter } from './models/planner.dto';
import { PlannersService } from './planners.service';

@Controller('planners')
export class PlannersController {
  constructor(
    private readonly plannersService: PlannersService,
    private readonly tasksService: TasksService,
  ) {}

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

  @Get(':plannerId/tasks')
  @HttpCode(HttpStatus.OK)
  async findAllByPlannerId(
    @Param('plannerId') plannerId: string,
    @Query() filter: TaskFilter,
  ) {
    return await this.tasksService.findAllByPlannerId(plannerId, filter);
  }
}
