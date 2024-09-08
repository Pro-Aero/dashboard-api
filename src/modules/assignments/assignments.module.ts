import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AssignmentRepository } from './repositories/assignment.repository';

@Module({
  imports: [UsersModule],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentRepository],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
