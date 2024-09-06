import { Planner, Prisma } from '@prisma/client';
import { PlannerDto } from '../models/planner.dto';
import { PlannerApiResponse, PlannerEntity } from '../models/planner.entity';

export class PlannersMapper {
  static modelToEntity(raw: Planner): PlannerEntity {
    const entity: PlannerEntity = {
      id: raw.id,
      groupId: raw.groupId,
      title: raw.title,
      owner: raw.owner,
      totalHours: raw.totalHours,
    };

    return entity;
  }

  static entityToModel(entity: PlannerEntity): Prisma.PlannerCreateInput {
    return {
      id: entity.id,
      group: { connect: { id: entity.groupId } },
      title: entity.title,
      owner: entity.owner,
      totalHours: entity.totalHours,
    };
  }

  static entityToDTO(entity: PlannerEntity): PlannerDto {
    return {
      id: entity.id,
      groupId: entity.groupId,
      title: entity.title,
      owner: entity.owner,
      totalHours: entity.totalHours,
    };
  }

  static apiToEntity(response: PlannerApiResponse): PlannerEntity {
    return {
      id: response.id,
      groupId: response.container.containerId,
      title: response.title,
      owner: response.owner,
    };
  }
}
