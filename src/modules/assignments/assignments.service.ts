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

  async upsert(dto: CreateAssignmentDto): Promise<void> {
    const userExists = await this.usersService.exists(dto.userId);
    const assignmentExists = await this.repository.exists(
      dto.taskId,
      dto.userId,
    );
    if (!userExists || assignmentExists) return;

    const entity: AssignmentEntity = {
      id: crypto.randomUUID(),
      taskId: dto.taskId,
      userId: dto.userId,
    };

    await this.repository.upsert(entity);
  }
}
