import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { prisma } from 'src/config/prisma-client';
import { makePagination } from 'src/helpers/makePagination';
import { PaginatedItems } from 'src/types/pagination-query';
import { TasksMapper } from '../mappers/task.mapper';
import { TaskFilter } from '../models/task.dto';
import { TaskEntity, TaskStatus } from '../models/task.entity';
@Injectable()
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
    const where: Prisma.TaskWhereInput = {
      ...(await this.buildTaskFilterCriteria(filter)),
      assignments: { some: { user: { id: userId, show: true } } },
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

  async findMostPriority(
    page: number,
    itemsPerPage: number,
    filter?: TaskFilter,
  ): Promise<PaginatedItems<TaskEntity>> {
    const where = {
      ...(await this.buildTaskFilterCriteria(filter)),
      completedDateTime: null,
      NOT: { dueDateTime: null, percentComplete: 100 },
    };

    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ dueDateTime: 'asc' }, { priority: 'desc' }],
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

  async countTasksByPriority(
    userId: string,
    filter?: TaskFilter,
  ): Promise<number[]> {
    const where: Prisma.TaskWhereInput = {
      ...(await this.buildTaskFilterCriteria(filter)),
      assignments: { some: { user: { id: userId, show: true } } },
    };

    const [totalTasks, countLow, countMedium, countImportant, countUrgent] =
      await Promise.all([
        prisma.task.count({ where }),
        prisma.task.count({ where: { ...where, priority: 9 } }),
        prisma.task.count({ where: { ...where, priority: 5 } }),
        prisma.task.count({ where: { ...where, priority: 3 } }),
        prisma.task.count({ where: { ...where, priority: 1 } }),
      ]);

    return [totalTasks, countLow, countMedium, countImportant, countUrgent];
  }

  async countTasksByStatus(
    userId: string,
    filter?: TaskFilter,
  ): Promise<number[]> {
    const where: Prisma.TaskWhereInput = {
      ...(await this.buildTaskFilterCriteria(filter)),
      assignments: { some: { user: { id: userId, show: true } } },
    };

    const tasks = await prisma.task.findMany({
      where,
      select: {
        startDateTime: true,
        dueDateTime: true,
        completedDateTime: true,
      },
    });

    const counts: number[] = [tasks.length, 0, 0, 0, 0, 0];

    for (const task of tasks) {
      const status = TasksMapper.toStatus(
        task.startDateTime,
        task.dueDateTime,
        task.completedDateTime,
      );

      switch (status) {
        case TaskStatus.NotStarted:
          counts[1] += 1;
          break;
        case TaskStatus.InProgress:
          counts[2] += 1;
          break;
        case TaskStatus.Completed:
          counts[3] += 1;
          break;
        case TaskStatus.NextOverdue:
          counts[4] += 1;
          break;
        case TaskStatus.Overdue:
          counts[5] += 1;
          break;
      }
    }

    return counts;
  }

  async buildTaskFilterCriteria(
    filter?: TaskFilter,
  ): Promise<Prisma.TaskWhereInput> {
    let percentComplete;

    if (filter?.notComplete) {
      percentComplete = { not: 100 };
    } else if (filter?.percentComplete) {
      percentComplete = filter.percentComplete;
    }

    const statusFilters: Prisma.TaskWhereInput[] = [];

    if (filter?.status?.includes(TaskStatus.Completed)) {
      statusFilters.push({ completedDateTime: { not: null } });
    }

    if (filter?.status?.includes(TaskStatus.NotStarted)) {
      const now = new Date();
      statusFilters.push({
        startDateTime: { not: null, gte: now },
        completedDateTime: null,
      });
    }

    if (filter?.status?.includes(TaskStatus.InProgress)) {
      const now = new Date();
      statusFilters.push({
        dueDateTime: { not: null, gte: now },
        startDateTime: { lte: now },
        completedDateTime: null,
      });
    }

    if (filter?.status?.includes(TaskStatus.NextOverdue)) {
      const now = DateTime.now();
      const oneWeekFromNow = now.plus({ days: 7 }).toJSDate();

      statusFilters.push({
        dueDateTime: { not: null, gte: now.toJSDate(), lte: oneWeekFromNow },
        completedDateTime: null,
      });
    }

    if (filter?.status?.includes(TaskStatus.Overdue)) {
      const now = new Date();
      statusFilters.push({
        dueDateTime: { not: null, lt: now },
        completedDateTime: null,
      });
    }

    const startDate = filter.startDate ? filter.startDate : undefined;
    const endDate = filter.endDate ? filter.endDate : undefined;

    const where: Prisma.TaskWhereInput = {
      title: filter?.title
        ? { contains: filter.title, mode: 'insensitive' }
        : undefined,
      priority: filter?.priority ?? undefined,
      startDateTime: { gte: startDate },
      dueDateTime: { lte: endDate },
      ...(percentComplete !== undefined && { percentComplete }),
      ...(statusFilters.length > 0 ? { OR: statusFilters } : {}),
    };

    return where;
  }
}
