import { prisma } from 'src/config/prisma-client';
import { AssignmentsMapper } from '../mappers/assignment.mapper';
import { AssignmentEntity } from '../models/assignment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssignmentRepository {
  async upsert(assignment: AssignmentEntity): Promise<void> {
    const data = AssignmentsMapper.entityToModel(assignment);

    await prisma.assignment.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async getAll(): Promise<AssignmentEntity[]> {
    const assignments = await prisma.assignment.findMany();
    return assignments.map(AssignmentsMapper.modelToEntity);
  }

  async remove(assignmentId: string): Promise<void> {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (assignment)
      await prisma.assignment.delete({ where: { id: assignmentId } });
  }

  async exists(taskId: string, userId: string): Promise<boolean> {
    const assignment = await prisma.assignment.findFirst({
      where: { taskId, userId },
    });
    return !!assignment;
  }
}
