import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { GroupsService } from 'src/modules/groups/groups.service';
import { PlannersMapper } from 'src/modules/planners/mappers/planner.mapper';
import {
  PlannerApiResponse,
  PlannerEntity,
} from 'src/modules/planners/models/planner.entity';
import { PlannersService } from 'src/modules/planners/planners.service';
import { GraphClientService } from './graph-client.service';

type PlannerResponse = {
  value: PlannerApiResponse[];
};

@Injectable()
export class SyncPlannersService {
  private client: Client;

  constructor(
    private readonly graphClientService: GraphClientService,
    private readonly groupsService: GroupsService,
    private readonly plannersService: PlannersService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const groups = await this.groupsService.findAll();

    const plannersArray = await Promise.all(
      groups.map(async (group) => this.getPlanners(group.id)),
    );

    const allPlanners: PlannerEntity[] = [];
    plannersArray.forEach((planners) => allPlanners.push(...planners));

    await Promise.all(
      allPlanners.map(
        async (planner) => await this.plannersService.upsert(planner),
      ),
    );

    await this.plannersService.removeOutdated(allPlanners);
  }

  async getPlanners(groupId: string): Promise<PlannerEntity[]> {
    const { value }: PlannerResponse = await this.client
      .api(`/groups/${groupId}/planner/plans`)
      .select('id,title,owner,container')
      .get();

    return value.map(PlannersMapper.apiToEntity);
  }
}
