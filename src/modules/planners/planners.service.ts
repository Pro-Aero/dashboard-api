import { Injectable } from '@nestjs/common';
import { PlannerEntity } from './models/planner.entity';
import { PlannerRepository } from './repositories/planner.repository';

@Injectable()
export class PlannersService {
  constructor(private readonly repository: PlannerRepository) {}

  async upsert(planner: PlannerEntity): Promise<PlannerEntity> {
    return await this.repository.upsert(planner);
  }

  async getAll(): Promise<PlannerEntity[]> {
    return await this.repository.getAll();
  }

  async removeOutdated(apiPlanners: PlannerEntity[]): Promise<void> {
    const dbPlanners = await this.repository.getAll();

    const apiPlannersMap = new Map(
      apiPlanners.map((planner) => [planner.id, planner]),
    );
    const plannersToRemove = dbPlanners.filter(
      (planner) => !apiPlannersMap.has(planner.id),
    );

    await Promise.all(
      plannersToRemove.map(
        async (planner) => await this.repository.remove(planner.id),
      ),
    );
  }
}
