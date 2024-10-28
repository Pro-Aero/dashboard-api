import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssignmentsModule } from '../assignments/assignments.module.js';
import { BucketsModule } from '../buckets/buckets.module.js';
import { GroupsModule } from '../groups/groups.module.js';
import { PlannersModule } from '../planners/planners.module.js';
import { TasksModule } from '../tasks/tasks.module.js';
import { UsersModule } from '../users/users.module.js';
import { GraphClientService } from './services/graph-client.service.js';
import { SyncBucketsService } from './services/sync-buckets.service.js';
import { SyncGroupsService } from './services/sync-groups.service.js';
import { SyncPlannersService } from './services/sync-planners.service.js';
import { SyncTasksService } from './services/sync-tasks.service.js';
import { SyncUsersService } from './services/sync-users.service.js';
import { SyncController } from './sync.controller.js';
import { SyncCron } from './sync.cron.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    GroupsModule,
    PlannersModule,
    BucketsModule,
    TasksModule,
    AssignmentsModule,
  ],
  controllers: [SyncController],
  providers: [
    SyncCron,
    GraphClientService,
    SyncUsersService,
    SyncGroupsService,
    SyncPlannersService,
    SyncBucketsService,
    SyncTasksService,
  ],
  exports: [SyncTasksService],
})
export class SyncModule {}
