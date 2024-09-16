import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupMapper } from './mappers/group.mapper';
import { GroupDto, GroupFilter } from './models/group.dto';
import { GroupEntity } from './models/group.entity';
import { GroupRepository } from './repositories/group.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupRepository) {}

  async findAll(filter?: GroupFilter): Promise<GroupDto[]> {
    const users = await this.repository.findAll(filter);
    return users.map(GroupMapper.entityToDTO);
  }

  async findById(userId: string): Promise<GroupDto> {
    const user = await this.repository.findById(userId);
    if (!user) throw new NotFoundException();
    return GroupMapper.entityToDTO(user);
  }

  async upsert(group: GroupEntity): Promise<void> {
    await this.repository.upsert(group);
  }

  async removeOutdated(apiGroups: GroupEntity[]): Promise<void> {
    const dbGroups = await this.repository.findAll();

    const apiGroupsMap = new Map(apiGroups.map((group) => [group.id, group]));
    const groupsToRemove = dbGroups.filter(
      (group) => !apiGroupsMap.has(group.id),
    );

    await Promise.all(
      groupsToRemove.map(
        async (group) => await this.repository.remove(group.id),
      ),
    );
  }
}
