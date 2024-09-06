import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './modules/env/env.module';
import { GroupsModule } from './modules/groups/groups.module';
import { PlannersModule } from './modules/planners/planners.module';
import { SyncModule } from './modules/sync/sync.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
