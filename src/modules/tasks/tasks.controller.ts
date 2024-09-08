import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('taskId') taskId: string) {
    return await this.tasksService.findById(taskId);
  }
}
