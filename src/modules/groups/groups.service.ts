import { Injectable } from '@nestjs/common';
import { GroupEntity } from './models/group.entity';
import { GroupRepository } from './repositories/group.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupRepository) {}

  async upsert(group: GroupEntity): Promise<GroupEntity> {
    return await this.repository.upsert(group);
  }

  async removeOutdatedGroups(apiGroups: GroupEntity[]): Promise<void> {
    const dbGroups = await this.repository.getAll();

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
