import { Prisma } from '@prisma/client';
import { prisma } from 'src/config/prisma-client';
import { makePagination } from 'src/helpers/makePagination';
import { PaginatedItems } from 'src/types/pagination-query';
import { TasksMapper } from '../mappers/task.mapper';
import { TaskFilter } from '../models/task.dto';
import { TaskEntity } from '../models/task.entity';

export class TaskRepository {
  async findAll(): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map(TasksMapper.modelToSimpleEntity);
  }

  async findAllByPlannerId(
    plannerId: string,
    filter?: TaskFilter,
  ): Promise<TaskEntity[]> {
    const where = await this.buildTaskFilterCriteria(filter, plannerId);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        planner: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    return tasks.map(TasksMapper.modelToEntity);
  }

  async findAllWithPagination(
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskEntity>> {
    const where = await this.buildTaskFilterCriteria(filter);

    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        include: {
          planner: true,
          assignments: {
            include: {
              user: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((task) => TasksMapper.modelToEntity(task)),
      pagination: makePagination(page, itemsPerPage, totalItems),
    };
  }

  async buildTaskFilterCriteria(
    filter?: TaskFilter,
    plannerId?: string,
  ): Promise<Prisma.TaskWhereInput> {
    const where: Prisma.TaskWhereInput = {
      plannerId: plannerId ? plannerId : undefined,
      title: filter?.title
        ? { contains: filter.title, mode: 'insensitive' }
        : undefined,
      percentComplete: filter?.percentComplete
        ? filter.percentComplete
        : undefined,
      priority: filter?.priority ? filter.priority : undefined,
    };

    return where;
  }

  async findById(taskId: string): Promise<TaskEntity> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        planner: true,
        assignments: {
          include: {
            user: true,
          },
        },
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
      include: {
        planner: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    return tasks.map(TasksMapper.modelToEntity);
  }

  async upsert(task: TaskEntity): Promise<void> {
    const data = TasksMapper.entityToModel(task);

    await prisma.task.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async remove(taskId: string): Promise<void> {
    await prisma.task.delete({ where: { id: taskId } });
  }
}
