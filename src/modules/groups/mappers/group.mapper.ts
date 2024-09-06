import { Prisma, Group } from '@prisma/client';
import { GroupEntity } from '../models/group.entity';
import { GroupDto } from '../models/group.dto';

export class GroupMapper {
  static modelToEntity(raw: Group): GroupEntity {
    const entity: GroupEntity = {
      id: raw.id,
      displayName: raw.displayName,
      description: raw.description,
      mail: raw.mail,
    };

    return entity;
  }

  static entityToModel(entity: GroupEntity): Prisma.GroupCreateInput {
    return {
      id: entity.id,
      displayName: entity.displayName,
      description: entity.description,
      mail: entity.mail,
    };
  }

  static entityToDTO(entity: GroupEntity): GroupDto {
    return {
      id: entity.id,
      displayName: entity.displayName,
      description: entity.description,
      mail: entity.mail,
    };
  }
}
