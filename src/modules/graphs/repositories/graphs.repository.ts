import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { prisma } from 'src/config/prisma-client';
import { TasksMapper } from 'src/modules/tasks/mappers/task.mapper';
import { TaskEntity } from 'src/modules/tasks/models/task.entity';
import { DateRangeFilter } from '../models/graphs.dto';

@Injectable()
export class GraphsRepository {
  async findAllTasks(
    userId: string,
    filter: DateRangeFilter,
  ): Promise<TaskEntity[]> {
    const startDate = filter.startDate
      ? filter.startDate
      : DateTime.now().set({ month: 1, day: 1 }).toJSDate();

    const endDate = filter.endDate ? filter.endDate : undefined;

    let tasks = await prisma.task.findMany({
      where: {
        assignments: { some: { user: { id: userId, show: true } } },
        startDateTime: { gte: startDate },
        dueDateTime: { lte: endDate },
        NOT: { hours: null },
      },
      include: {
        planner: true,
        assignments: {
          include: { user: true },
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { priority: 'asc' },
    });

    tasks = tasks.filter((t) => t.assignments.some((a) => a.userId === userId));

    return tasks.map(TasksMapper.modelToEntity);
  }
}
