import { prisma } from 'src/config/prisma-client';
import { AssignmentsMapper } from '../mappers/assignment.mapper';
import { AssignmentEntity } from '../models/assignment.entity';

export class AssignmentRepository {
  async upsert(assignment: AssignmentEntity): Promise<AssignmentEntity> {
    const data = AssignmentsMapper.entityToModel(assignment);

    const assignmentModel = await prisma.assignment.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    return AssignmentsMapper.modelToEntity(assignmentModel);
  }

  async getAll(): Promise<AssignmentEntity[]> {
    const assignments = await prisma.assignment.findMany();
    return assignments.map(AssignmentsMapper.modelToEntity);
  }

  async remove(assignmentId: string): Promise<void> {
    await prisma.assignment.delete({ where: { id: assignmentId } });
  }
}
