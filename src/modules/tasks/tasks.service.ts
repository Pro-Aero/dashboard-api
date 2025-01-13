import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedItems } from 'src/types/pagination-query';
import { TasksMapper } from './mappers/task.mapper';
import { TaskDto, TaskFilter } from './models/task.dto';
import { TaskEntity } from './models/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TaskRepository) {}

  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.repository.findAll();
    return tasks.map(TasksMapper.entityToDTO);
  }

  async findMostPriority(
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskDto>> {
    const tasks = await this.repository.findMostPriority(
      page,
      itemsPerPage,
      filter,
    );

    const dto: PaginatedItems<TaskDto> = {
      data: tasks.data.map(TasksMapper.entityToDTO),
      pagination: tasks.pagination,
    };

    return dto;
  }

  async findAllByPlannerWithPagination(
    plannerId: string,
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskDto>> {
    const tasks = await this.repository.findAllByPlannerWithPagination(
      plannerId,
      page,
      itemsPerPage,
      filter,
    );

    const dto: PaginatedItems<TaskDto> = {
      data: tasks.data.map(TasksMapper.entityToDTO),
      pagination: tasks.pagination,
    };

    return dto;
  }

  async findAllByUserWithPagination(
    userId: string,
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskDto>> {
    const tasks = await this.repository.findAllByUserWithPagination(
      userId,
      page,
      itemsPerPage,
      filter,
    );

    const dto: PaginatedItems<TaskDto> = {
      data: tasks.data.map(TasksMapper.entityToDTO),
      pagination: tasks.pagination,
    };

    return dto;
  }

  async findAllWithPagination(
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskDto>> {
    const tasks = await this.repository.findAllWithPagination(
      page,
      itemsPerPage,
      filter,
    );

    const dto: PaginatedItems<TaskDto> = {
      data: tasks.data.map(TasksMapper.entityToDTO),
      pagination: tasks.pagination,
    };

    return dto;
  }

  async findById(taskId: string): Promise<TaskDto> {
    const task = await this.repository.findById(taskId);
    if (!task) throw new NotFoundException();
    return TasksMapper.entityToDTO(task);
  }

  async upsert(task: TaskEntity): Promise<void> {
    await this.repository.upsert(task);
  }

  async removeOutdated(apiTasks: TaskEntity[]): Promise<void> {
    const dbTasks = await this.repository.findAll();

    const apiTasksMap = new Map(apiTasks.map((task) => [task.id, task]));

    const tasksToRemove = dbTasks.filter((task) => !apiTasksMap.has(task.id));

    await Promise.all(
      tasksToRemove.map(async (task) => await this.repository.remove(task.id)),
    );
  }

  async countTasksByPriority(
    userId: string,
    filter?: TaskFilter,
  ): Promise<number[]> {
    return await this.repository.countTasksByPriority(userId, filter);
  }

  async countTasksByStatus(
    userId: string,
    filter?: TaskFilter,
  ): Promise<number[]> {
    return await this.repository.countTasksByStatus(userId, filter);
  }

  extractHoursFromTitle(title: string): number {
    const match = title.match(/\{\s*(\d+)\s*\}/);
    return match ? parseInt(match[1], 10) : null;
  }
}
