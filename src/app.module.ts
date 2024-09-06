import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './modules/env/env.module';
import { PlannerSyncModule } from './modules/planner-sync/planner-sync.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { PlannersModule } from './modules/planners/planners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PlannerSyncModule,
    EnvModule,
    UsersModule,
    GroupsModule,
    PlannersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
