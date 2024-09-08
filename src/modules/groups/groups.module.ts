import { Module } from '@nestjs/common';
import { PlannersModule } from '../planners/planners.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupRepository } from './repositories/group.repository';

@Module({
  imports: [PlannersModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupRepository],
  exports: [GroupsService],
})
export class GroupsModule {}
