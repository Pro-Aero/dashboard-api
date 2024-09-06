import { prisma } from 'src/config/prisma-client';
import { TaskEntity } from '../models/task.entity';
import { TasksMapper } from '../mappers/task.mapper';

export class TaskRepository {
  async upsert(task: TaskEntity): Promise<TaskEntity> {
    const data = TasksMapper.entityToModel(task);

    const taskModel = await prisma.task.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return TasksMapper.modelToEntity(taskModel);
  }

  async getAll(): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map(TasksMapper.modelToEntity);
  }

  async remove(taskId: string): Promise<void> {
    await prisma.task.delete({ where: { id: taskId } });
  }
}
