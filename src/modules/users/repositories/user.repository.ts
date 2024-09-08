import { prisma } from 'src/config/prisma-client';
import { UsersMapper } from '../mappers/user.mapper';
import { UserFilter } from '../models/user.dto';
import { UserEntity } from '../models/user.entity';

export class UserRepository {
  async upsert(user: UserEntity): Promise<UserEntity> {
    const data = UsersMapper.entityToModel(user);

    const userModel = await prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return UsersMapper.modelToEntity(userModel);
  }

  async findAll(filter?: UserFilter): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: {
        displayName: filter?.displayName
          ? { contains: filter.displayName, mode: 'insensitive' }
          : undefined,
        mail: filter?.mail
          ? { contains: filter.mail, mode: 'insensitive' }
          : undefined,
      },
    });

    return users.map(UsersMapper.modelToEntity);
  }

  async findById(userId: string): Promise<UserEntity> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return null;

    return UsersMapper.modelToEntity(user);
  }

  async remove(userId: string): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }
}
