import { Injectable } from '@nestjs/common';
import { prisma } from 'src/config/prisma-client';
import { UsersMapper } from '../mappers/user.mapper';
import { UserFilter } from '../models/user.dto';
import { ShowUsersFilter, UserEntity } from '../models/user.entity';

@Injectable()
export class UserRepository {
  async findAll(filter?: UserFilter): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: {
        displayName: filter?.displayName
          ? { contains: filter.displayName, mode: 'insensitive' }
          : undefined,
        mail: filter?.mail
          ? { contains: filter.mail, mode: 'insensitive' }
          : undefined,
        show: filter.show,
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

  async upsert(user: UserEntity): Promise<void> {
    user.show = true;
    if (ShowUsersFilter.includes(user.mail)) {
      user.show = false;
    }

    const data = UsersMapper.entityToModel(user);

    await prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async remove(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) await prisma.user.delete({ where: { id: userId } });
  }

  async calculateBusyHours(userId: string): Promise<number> {
    const result = await prisma.task.aggregate({
      where: {
        assignments: { some: { userId } },
        NOT: { OR: [{ percentComplete: 100 }, { hours: null }] },
      },
      _sum: {
        hours: true,
      },
    });

    return result._sum.hours ?? 0;
  }
}
