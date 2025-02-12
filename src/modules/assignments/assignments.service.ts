import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateAssignmentDto } from './models/assignment.dto';
import { AssignmentEntity } from './models/assignment.entity';
import { AssignmentRepository } from './repositories/assignment.repository';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly repository: AssignmentRepository,
    private readonly usersService: UsersService,
  ) {}

  async upsert(dto: CreateAssignmentDto): Promise<AssignmentEntity | null> {
    const userExists = await this.usersService.exists(dto.userId);
    const assignment = await this.repository.find(dto.taskId, dto.userId);
    if (!userExists || assignment) return assignment;

    const entity: AssignmentEntity = {
      id: crypto.randomUUID(),
      taskId: dto.taskId,
      userId: dto.userId,
    };

    await this.repository.upsert(entity);
    return entity;
  }

  async removeOutdated(apiAssignments: AssignmentEntity[]): Promise<void> {
    const dbAssignment = await this.repository.getAll();

    const apiAssignmentsMap = new Map(
      apiAssignments.map((item) => [item.id, item]),
    );

    const assignmentsToRemove = dbAssignment.filter(
      (item) => !apiAssignmentsMap.has(item.id),
    );

    await Promise.all(
      assignmentsToRemove.map(
        async (item) => await this.repository.remove(item.id),
      ),
    );
  }
}
