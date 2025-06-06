import { Prisma, Task } from '@prisma/client';
import { DateTime } from 'luxon';
import { TaskDto } from '../models/task.dto';
import { TaskApiResponse, TaskEntity, TaskStatus } from '../models/task.entity';
export class TasksMapper {
  static modelToEntity(
    raw: Prisma.TaskGetPayload<{
      include: {
        planner: true;
        assignments: {
          include: {
            user: true;
          };
        };
      };
    }>,
  ): TaskEntity {
    const entity: TaskEntity = {
      id: raw.id,
      bucketId: raw.bucketId,
      title: raw.title,
      percentComplete: raw.percentComplete,
      priority: raw.priority,
      startDateTime: raw.startDateTime,
      dueDateTime: raw.dueDateTime,
      completedDateTime: raw.completedDateTime,
      hours: raw.hours,
      status: TasksMapper.toStatus(
        raw.startDateTime,
        raw.dueDateTime,
        raw.completedDateTime,
      ),
      planner: {
        id: raw.planner.id,
        title: raw.planner.title,
      },
      assignments: raw.assignments.map((assignment) => {
        return {
          id: assignment.user.id,
          name: assignment.user.displayName,
        };
      }),
    };

    return entity;
  }

  static modelToSimpleEntity(raw: Task): TaskEntity {
    const entity: TaskEntity = {
      id: raw.id,
      plannerId: raw.plannerId,
      bucketId: raw.bucketId,
      title: raw.title,
      percentComplete: raw.percentComplete,
      priority: raw.priority,
      startDateTime: raw.startDateTime,
      dueDateTime: raw.dueDateTime,
      completedDateTime: raw.completedDateTime,
      hours: raw.hours,
      status: TasksMapper.toStatus(
        raw.startDateTime,
        raw.dueDateTime,
        raw.completedDateTime,
      ),
    };

    return entity;
  }

  static entityToModel(entity: TaskEntity): Prisma.TaskCreateInput {
    return {
      id: entity.id,
      planner: { connect: { id: entity.planner.id } },
      bucket: entity.bucketId
        ? { connect: { id: entity.bucketId } }
        : undefined,
      title: entity.title,
      percentComplete: entity.percentComplete,
      priority: entity.priority,
      startDateTime: entity.startDateTime,
      dueDateTime: entity.dueDateTime,
      completedDateTime: entity.completedDateTime,
      hours: entity.hours,
    };
  }

  static entityToDTO(entity: TaskEntity): TaskDto {
    return {
      id: entity.id,
      bucketId: entity.bucketId,
      title: entity.title,
      percentComplete: entity.percentComplete,
      priority: entity.priority,
      startDateTime: entity.startDateTime,
      dueDateTime: entity.dueDateTime,
      completedDateTime: entity.completedDateTime,
      hours: entity.hours,
      status: entity.status,
      planner: {
        id: entity.planner.id,
        title: entity.planner.title,
      },
      assignments: entity.assignments.map((assignment) => {
        return {
          id: assignment.id,
          name: assignment.name,
        };
      }),
    };
  }

  static apiToEntity(response: TaskApiResponse): TaskEntity {
    return {
      id: response.id,
      bucketId: response.bucketId,
      title: response.title,
      percentComplete: response.percentComplete,
      priority: response.priority,
      startDateTime: response.startDateTime,
      dueDateTime: response.dueDateTime,
      completedDateTime: response.completedDateTime,
      planner: { id: response.planId },
      assignments: Object.keys(response.assignments).map((userId) => {
        return {
          id: userId,
        };
      }),
    };
  }

  static toStatus(
    startDateTime?: Date,
    dueDateTime?: Date,
    completedDateTime?: Date,
  ): TaskStatus {
    const now = DateTime.now().endOf('day');

    if (completedDateTime) {
      return TaskStatus.Completed;
    }

    if (dueDateTime) {
      const dueDate = DateTime.fromJSDate(dueDateTime);

      if (now > dueDate) {
        return TaskStatus.Overdue;
      }

      const daysToDue = dueDate.diff(now, 'days').days;
      if (daysToDue <= 7 && daysToDue > 0) {
        return TaskStatus.NextOverdue;
      }
    }

    if (startDateTime && now <= DateTime.fromJSDate(startDateTime)) {
      return TaskStatus.NotStarted;
    }

    return TaskStatus.InProgress;
  }
}
