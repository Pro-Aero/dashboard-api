import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('priority')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.tasksService.mostPriority();
  }

  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('taskId') taskId: string) {
    return await this.tasksService.findById(taskId);
  }
}
