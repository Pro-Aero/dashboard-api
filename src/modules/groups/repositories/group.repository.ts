import { prisma } from 'src/config/prisma-client';
import { GroupMapper } from '../mappers/group.mapper';
import { GroupFilter } from '../models/group.dto';
import { GroupEntity } from '../models/group.entity';

export class GroupRepository {
  async findAll(filter?: GroupFilter): Promise<GroupEntity[]> {
    const groups = await prisma.group.findMany({
      where: {
        displayName: filter?.displayName
          ? { contains: filter.displayName, mode: 'insensitive' }
          : undefined,
        mail: filter?.mail
          ? { contains: filter.mail, mode: 'insensitive' }
          : undefined,
      },
    });

    return groups.map(GroupMapper.modelToEntity);
  }

  async findById(groupId: string): Promise<GroupEntity> {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) return null;

    return GroupMapper.modelToEntity(group);
  }

  async upsert(group: GroupEntity): Promise<void> {
    const data = GroupMapper.entityToModel(group);

    await prisma.group.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async remove(groupId: string): Promise<void> {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (group) await prisma.group.delete({ where: { id: groupId } });
  }
}
