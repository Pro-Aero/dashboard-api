import { prisma } from 'src/config/prisma-client';
import { PlannersMapper } from '../mappers/planner.mapper';
import { PlannerEntity } from '../models/planner.entity';

export class PlannerRepository {
  async upsert(user: PlannerEntity): Promise<PlannerEntity> {
    const data = PlannersMapper.entityToModel(user);

    const userModel = await prisma.planner.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return PlannersMapper.modelToEntity(userModel);
  }

  async getAll(): Promise<PlannerEntity[]> {
    const planners = await prisma.planner.findMany();
    return planners.map(PlannersMapper.modelToEntity);
  }

  async remove(userId: string): Promise<void> {
    await prisma.planner.delete({ where: { id: userId } });
  }
}
