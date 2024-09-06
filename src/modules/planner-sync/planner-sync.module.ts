import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupsModule } from '../groups/groups.module.js';
import { UsersModule } from '../users/users.module.js';
import { PlannerSyncCron } from './planner-sync.cron.js';
import { GraphClientService } from './services/graph-client.service.js';
import { SyncGroupsService } from './services/sync-groups.service.js';
import { SyncUsersService } from './services/sync-users.service.js';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule, GroupsModule],
  providers: [
    PlannerSyncCron,
    GraphClientService,
    SyncUsersService,
    SyncGroupsService,
  ],
})
export class PlannerSyncModule {}
