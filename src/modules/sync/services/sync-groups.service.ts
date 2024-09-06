import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { GroupsService } from 'src/modules/groups/groups.service';
import { GroupEntity } from 'src/modules/groups/models/group.entity';
import { GraphClientService } from './graph-client.service';

type GroupResponse = {
  value: GroupEntity[];
};

@Injectable()
export class SyncGroupsService {
  private client: Client;

  constructor(
    private readonly graphClientService: GraphClientService,
    private readonly groupsService: GroupsService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const groups = await this.getGroups();

    await Promise.all(
      groups.map(async (user) => await this.groupsService.upsert(user)),
    );

    await this.groupsService.removeOutdated(groups);
  }

  async getGroups(): Promise<GroupEntity[]> {
    const { value }: GroupResponse = await this.client
      .api('/groups')
      .select('id,displayName,description,mail')
      .get();

    return value;
  }
}
