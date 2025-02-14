import { Injectable } from '@nestjs/common';
import { prisma } from 'src/config/prisma-client';
import { TasksMapper } from 'src/modules/tasks/mappers/task.mapper';
import { TaskEntity } from 'src/modules/tasks/models/task.entity';
import { DateRangeFilter } from '../models/graphs.dto';

@Injectable()
export class GraphsRepository {
  async findAllUserTasks(
    userId: string,
    filter: DateRangeFilter,
  ): Promise<TaskEntity[]> {
    const tasks = await prisma.task.findMany({
      where: {
        assignments: { some: { userId } },
        startDateTime: { gte: filter.startDate },
        dueDateTime: { lte: filter.endDate },
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
      orderBy: [{ startDateTime: 'asc' }, { priority: 'asc' }],
    });

    return tasks.map(TasksMapper.modelToEntity);
  }
}
