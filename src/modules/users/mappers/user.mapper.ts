import { Prisma, User } from '@prisma/client';
import { UserDto } from '../models/user.dto';
import { UserEntity } from '../models/user.entity';

export class UsersMapper {
  static modelToEntity(raw: User): UserEntity {
    const entity: UserEntity = {
      id: raw.id,
      displayName: raw.displayName,
      userPrincipalName: raw.userPrincipalName,
      mail: raw.mail,
      jobTitle: raw.jobTitle,
    };

    return entity;
  }

  static entityToModel(entity: UserEntity): Prisma.UserCreateInput {
    return {
      id: entity.id,
      displayName: entity.displayName,
      userPrincipalName: entity.userPrincipalName,
      mail: entity.mail,
      jobTitle: entity.jobTitle,
    };
  }

  static entityToDTO(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      displayName: entity.displayName,
      userPrincipalName: entity.userPrincipalName,
      mail: entity.mail,
      jobTitle: entity.jobTitle,
      busyHours: entity.busyHours,
    };
  }
}
