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

  async findMostPriority(): Promise<TaskEntity[]> {
    const tasks = await this.repository.findMostPriority();
    return tasks.map(TasksMapper.entityToDTO);
  }

  async findAllByPlannerId(
    plannerId: string,
    filter?: TaskFilter,
  ): Promise<TaskDto[]> {
    const tasks = await this.repository.findAllByPlannerId(plannerId, filter);
    return tasks.map(TasksMapper.entityToDTO);
  }

  async findAllByUserId(
    userId: string,
    filter?: TaskFilter,
  ): Promise<TaskDto[]> {
    const tasks = await this.repository.findAllByUserId(userId, filter);
    return tasks.map(TasksMapper.entityToDTO);
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

    tasks.data = tasks.data.map(TasksMapper.entityToDTO);

    return tasks;
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

  extractHoursFromTitle(title: string): number {
    const parts = title.split('-');
    const lastPart = parts[parts.length - 1].trim();

    const hour = Number(lastPart);

    return isNaN(hour) ? null : hour;
  }
}
