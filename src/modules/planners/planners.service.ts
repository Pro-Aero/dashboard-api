import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { PlannersMapper } from './mappers/planner.mapper';
import { PlannerDto, PlannerFilter } from './models/planner.dto';
import { PlannerEntity } from './models/planner.entity';
import { PlannerRepository } from './repositories/planner.repository';

@Injectable()
export class PlannersService {
  constructor(
    private readonly repository: PlannerRepository,
    private readonly tasksService: TasksService,
  ) {}

  async findAll(filter?: PlannerFilter): Promise<PlannerDto[]> {
    const planners = await this.repository.findAll(filter);
    return planners.map(PlannersMapper.entityToDTO);
  }

  async findById(plannerId: string): Promise<PlannerDto> {
    const planner = await this.repository.findById(plannerId);
    if (!planner) throw new NotFoundException();
    return PlannersMapper.entityToDTO(planner);
  }

  async findAllByGroupId(
    groupId: string,
    filter?: PlannerFilter,
  ): Promise<PlannerDto[]> {
    const planners = await this.repository.findAllByGroupId(groupId, filter);
    return planners.map(PlannersMapper.entityToDTO);
  }

  async upsert(planner: PlannerEntity): Promise<void> {
    await this.repository.upsert(planner);
  }

  async removeOutdated(apiPlanners: PlannerEntity[]): Promise<void> {
    const dbPlanners = await this.repository.findAll();

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

  async calculateTotalHours(planner: PlannerEntity): Promise<void> {
    const totalHours = await this.repository.calculateTotalHours(planner.id);
    planner.totalHours = totalHours;
    await this.repository.update(planner.id, planner);
  }
}
