import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GraphsController } from './graphs.controller';
import { GraphsService } from './graphs.service';
import { GraphsRepository } from './repositories/graphs.repository';

@Module({
  imports: [UsersModule],
  controllers: [GraphsController],
  providers: [GraphsService, GraphsRepository],
})
export class GraphsModule {}
