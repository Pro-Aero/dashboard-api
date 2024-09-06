import { Injectable } from '@nestjs/common';
import { TaskEntity } from './models/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TaskRepository) {}

  async upsert(task: TaskEntity): Promise<TaskEntity> {
    return await this.repository.upsert(task);
  }

  async getAll(): Promise<TaskEntity[]> {
    return await this.repository.getAll();
  }

  async removeOutdated(apiTasks: TaskEntity[]): Promise<void> {
    const dbTasks = await this.repository.getAll();

    const apiTasksMap = new Map(apiTasks.map((task) => [task.id, task]));
    const tasksToRemove = dbTasks.filter((task) => !apiTasksMap.has(task.id));

    await Promise.all(
      tasksToRemove.map(async (task) => await this.repository.remove(task.id)),
    );
  }
}
