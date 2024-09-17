import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationQueryWithTaskFilter } from '../tasks/models/task.dto';
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
  async findAllByPlannerIdWithPagination(
    @Param('plannerId') plannerId: string,
    @Query() query: PaginationQueryWithTaskFilter,
  ) {
    const { page, itemsPerPage, ...filter } = query;

    return await this.tasksService.findAllByPlannerWithPagination(
      plannerId,
      page,
      itemsPerPage,
      filter,
    );
  }
}
