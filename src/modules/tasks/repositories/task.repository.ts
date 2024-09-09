import { prisma } from 'src/config/prisma-client';
import { TasksMapper } from '../mappers/task.mapper';
import { TaskFilter } from '../models/task.dto';
import { TaskEntity } from '../models/task.entity';

export class TaskRepository {
  async findAll(): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map(TasksMapper.modelToEntity);
  }

  async findAllByPlannerId(
    plannerId: string,
    filter?: TaskFilter,
  ): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany({
      where: {
        plannerId,
        title: filter?.title
          ? { contains: filter.title, mode: 'insensitive' }
          : undefined,
        percentComplete: filter?.percentComplete
          ? filter.percentComplete
          : undefined,
        priority: filter?.priority ? filter.priority : undefined,
      },
    });

    return tasks.map(TasksMapper.modelToEntity);
  }

  async findById(taskId: string): Promise<TaskEntity> {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) return null;

    return TasksMapper.modelToEntity(task);
  }

  async findMostPriority(): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany({
      where: {
        completedDateTime: null,
        NOT: { dueDateTime: null, percentComplete: 100 },
      },
      orderBy: [{ dueDateTime: 'asc' }, { priority: 'desc' }],
    });

    return tasks.map(TasksMapper.modelToEntity);
  }

  async upsert(task: TaskEntity): Promise<TaskEntity> {
    const data = TasksMapper.entityToModel(task);

    const taskModel = await prisma.task.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return TasksMapper.modelToEntity(taskModel);
  }

  async remove(taskId: string): Promise<void> {
    await prisma.task.delete({ where: { id: taskId } });
  }
}
