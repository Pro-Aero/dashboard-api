import { Module } from '@nestjs/common';
import { PlannersController } from './planners.controller';
import { PlannersService } from './planners.service';
import { PlannerRepository } from './repositories/planner.repository';

@Module({
  controllers: [PlannersController],
  providers: [PlannersService, PlannerRepository],
  exports: [PlannersService],
})
export class PlannersModule {}
