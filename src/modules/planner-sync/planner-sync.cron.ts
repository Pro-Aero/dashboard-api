import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncUsersService } from './services/sync-users.service';

@Injectable()
export class PlannerSyncCron {
  private readonly logger = new Logger(PlannerSyncCron.name);

  constructor(private readonly syncUsersService: SyncUsersService) {}

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sync' })
  async handle() {
    this.logger.log('Sync start');
    this.logger.log('Sync finished');
  }
}
