import { prisma } from 'src/config/prisma-client';
import { GroupMapper } from '../mappers/group.mapper';
import { GroupEntity } from '../models/group.entity';

export class GroupRepository {
  async upsert(user: GroupEntity): Promise<GroupEntity> {
    const data = GroupMapper.entityToModel(user);

    const groupModel = await prisma.group.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return GroupMapper.modelToEntity(groupModel);
  }

  async getAll(): Promise<GroupEntity[]> {
    const groups = await prisma.group.findMany();
    return groups.map(GroupMapper.modelToEntity);
  }

  async remove(userId: string): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }
}
