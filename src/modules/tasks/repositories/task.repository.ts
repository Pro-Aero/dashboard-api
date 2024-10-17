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

  async findAllByPlannerWithPagination(
    plannerId: string,
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskEntity>> {
    const where = {
      ...(await this.buildTaskFilterCriteria(filter)),
      plannerId: plannerId,
    };

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

  async findAllByUserWithPagination(
    userId: string,
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskEntity>> {
    const where = {
      ...(await this.buildTaskFilterCriteria(filter)),
      assignments: { some: { userId } },
    };

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
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (task) await prisma.task.delete({ where: { id: taskId } });
  }

  async countTasksByPriority(userId: string): Promise<number[]> {
    const filter: Prisma.TaskWhereInput = {
      assignments: { some: { userId } },
      NOT: { percentComplete: 100 },
    };

    const [totalTasks, countLow, countMedium, countImportant, countUrgent] =
      await Promise.all([
        prisma.task.count({ where: filter }),
        prisma.task.count({ where: { ...filter, priority: 9 } }),
        prisma.task.count({ where: { ...filter, priority: 5 } }),
        prisma.task.count({ where: { ...filter, priority: 3 } }),
        prisma.task.count({ where: { ...filter, priority: 1 } }),
      ]);

    return [totalTasks, countLow, countMedium, countImportant, countUrgent];
  }

  async buildTaskFilterCriteria(
    filter?: TaskFilter,
  ): Promise<Prisma.TaskWhereInput> {
    const where: Prisma.TaskWhereInput = {
      title: filter?.title
        ? { contains: filter?.title, mode: 'insensitive' }
        : undefined,
      percentComplete: filter?.percentComplete ?? undefined,
      priority: filter?.priority ?? undefined,
    };

    return where;
  }
}
