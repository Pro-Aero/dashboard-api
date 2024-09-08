import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksMapper } from './mappers/task.mapper';
import { TaskDto, TaskFilter } from './models/task.dto';
import { TaskEntity } from './models/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TaskRepository) {}

  async findAll(): Promise<TaskEntity[]> {
    return await this.repository.findAll();
  }

  async findAllByPlannerId(
    taskId: string,
    filter?: TaskFilter,
  ): Promise<TaskDto[]> {
    const tasks = await this.repository.findAllByPlannerId(taskId, filter);
    return tasks.map(TasksMapper.entityToDTO);
  }

  async findById(taskId: string): Promise<TaskDto> {
    const task = await this.repository.findById(taskId);
    if (!task) throw new NotFoundException();
    return TasksMapper.entityToDTO(task);
  }

  async upsert(task: TaskEntity): Promise<TaskEntity> {
    return await this.repository.upsert(task);
  }

  async removeOutdated(apiTasks: TaskEntity[]): Promise<void> {
    const dbTasks = await this.repository.findAll();

    const apiTasksMap = new Map(apiTasks.map((task) => [task.id, task]));
    const tasksToRemove = dbTasks.filter((task) => !apiTasksMap.has(task.id));

    await Promise.all(
      tasksToRemove.map(async (task) => await this.repository.remove(task.id)),
    );
  }
}
