import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupsModule } from '../groups/groups.module.js';
import { PlannersModule } from '../planners/planners.module.js';
import { UsersModule } from '../users/users.module.js';
import { PlannerSyncCron } from './planner-sync.cron.js';
import { GraphClientService } from './services/graph-client.service.js';
import { SyncGroupsService } from './services/sync-groups.service.js';
import { SyncPlannersService } from './services/sync-planners.service.js';
import { SyncUsersService } from './services/sync-users.service.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    GroupsModule,
    PlannersModule,
  ],
  providers: [
    PlannerSyncCron,
    GraphClientService,
    SyncUsersService,
    SyncGroupsService,
    SyncPlannersService,
  ],
})
export class PlannerSyncModule {}
