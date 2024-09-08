import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { PlannersController } from './planners.controller';
import { PlannersService } from './planners.service';
import { PlannerRepository } from './repositories/planner.repository';

@Module({
  imports: [TasksModule],
  controllers: [PlannersController],
  providers: [PlannersService, PlannerRepository],
  exports: [PlannersService],
})
export class PlannersModule {}
