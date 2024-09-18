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
import { UserFilter } from './models/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: UserFilter) {
    return await this.usersService.findAll(filter);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('userId') userId: string) {
    return await this.usersService.findById(userId);
  }

  @Get(':userId/tasks')
  @HttpCode(HttpStatus.OK)
  async findAllTasksByUser(
    @Param('userId') userId: string,
    @Query() query: PaginationQueryWithTaskFilter,
  ) {
    const { page, itemsPerPage, ...filter } = query;

    return await this.tasksService.findAllByUserWithPagination(
      userId,
      page,
      itemsPerPage,
      filter,
    );
  }

  @Get(':userId/tasks/status')
  @HttpCode(HttpStatus.OK)
  async getUserTasksStatus(@Param('userId') userId: string) {
    return await this.usersService.getUserTasksStatus(userId);
  }
}
