import { prisma } from 'src/config/prisma-client';
import { UsersMapper } from '../mappers/user.mapper';
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

  async getAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();
    return users.map(UsersMapper.modelToEntity);
  }

  async remove(userId: string): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }
}
