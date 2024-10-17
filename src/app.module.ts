import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AuthModule } from './modules/auth/auth.module';
import { BucketsModule } from './modules/buckets/buckets.module';
import { EnvModule } from './modules/env/env.module';
import { GraphsModule } from './modules/graphs/graphs.module';
import { GroupsModule } from './modules/groups/groups.module';
import { HealthModule } from './modules/health/health.module';
import { PlannersModule } from './modules/planners/planners.module';
import { SyncModule } from './modules/sync/sync.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SyncModule,
    EnvModule,
    UsersModule,
    GroupsModule,
    PlannersModule,
    TasksModule,
    BucketsModule,
    AssignmentsModule,
    AuthModule,
    GraphsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
