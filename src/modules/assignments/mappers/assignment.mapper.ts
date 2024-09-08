import { Assignment, Prisma } from '@prisma/client';
import { AssignmentDto } from '../models/assignment.dto';
import { AssignmentEntity } from '../models/assignment.entity';

export class AssignmentsMapper {
  static modelToEntity(raw: Assignment): AssignmentEntity {
    const entity: AssignmentEntity = {
      id: raw.id,
      taskId: raw.taskId,
      userId: raw.userId,
    };

    return entity;
  }

  static entityToModel(entity: AssignmentEntity): Prisma.AssignmentCreateInput {
    return {
      id: entity.id,
      task: { connect: { id: entity.taskId } },
      user: { connect: { id: entity.userId } },
    };
  }

  static entityToDTO(entity: AssignmentEntity): AssignmentDto {
    return {
      id: entity.id,
      taskId: entity.taskId,
      userId: entity.userId,
    };
  }
}
