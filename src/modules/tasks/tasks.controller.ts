import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationQueryWithTaskFilter } from './models/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('priority')
  @HttpCode(HttpStatus.OK)
  async findMostPriority() {
    return await this.tasksService.findMostPriority();
  }

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('taskId') taskId: string) {
    return await this.tasksService.findById(taskId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllWithPagination(@Query() query: PaginationQueryWithTaskFilter) {
    return await this.tasksService.findAllWithPagination(
      query.page,
      query.itemsPerPage,
    );
  }
}
