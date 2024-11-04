import { Injectable } from '@nestjs/common';
import { prisma } from 'src/config/prisma-client';
import { PlannersMapper } from '../mappers/planner.mapper';
import { PlannerFilter } from '../models/planner.dto';
import { PlannerEntity } from '../models/planner.entity';
@Injectable()
export class PlannerRepository {
  async findAll(filter?: PlannerFilter): Promise<PlannerEntity[]> {
    const planners = await prisma.planner.findMany({
      where: {
        title: filter?.title
          ? { contains: filter.title, mode: 'insensitive' }
          : undefined,
      },
    });

    return planners.map(PlannersMapper.modelToEntity);
  }

  async findAllByGroupId(
    groupId: string,
    filter?: PlannerFilter,
  ): Promise<PlannerEntity[]> {
    const planners = await prisma.planner.findMany({
      where: {
        groupId,
        title: filter?.title
          ? { contains: filter.title, mode: 'insensitive' }
          : undefined,
      },
    });

    return planners.map(PlannersMapper.modelToEntity);
  }

  async findById(plannerId: string): Promise<PlannerEntity> {
    const planner = await prisma.planner.findUnique({
      where: {
        id: plannerId,
      },
    });

    if (!planner) return null;

    return PlannersMapper.modelToEntity(planner);
  }

  async upsert(user: PlannerEntity): Promise<void> {
    const data = PlannersMapper.entityToModel(user);

    await prisma.planner.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async update(
    plannerId: string,
    planner: Partial<PlannerEntity>,
  ): Promise<PlannerEntity> {
    const updatedPlanner = await prisma.planner.update({
      where: { id: plannerId },
      data: {
        totalHours: planner.totalHours,
      },
    });

    return PlannersMapper.modelToEntity(updatedPlanner);
  }

  async remove(plannerId: string): Promise<void> {
    const planner = await prisma.planner.findUnique({
      where: { id: plannerId },
    });
    if (planner) await prisma.planner.delete({ where: { id: plannerId } });
  }

  async calculateTotalHours(plannerId: string): Promise<number> {
    const result = await prisma.task.aggregate({
      where: {
        plannerId,
        NOT: { hours: null, percentComplete: 100 },
      },
      _sum: { hours: true },
    });

    return result._sum.hours ?? 0;
  }
}
