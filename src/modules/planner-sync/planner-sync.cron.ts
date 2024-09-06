import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncGroupsService } from './services/sync-groups.service';
import { SyncPlannersService } from './services/sync-planners.service';
import { SyncUsersService } from './services/sync-users.service';

@Injectable()
export class PlannerSyncCron {
  private readonly logger = new Logger(PlannerSyncCron.name);

  constructor(
    private readonly syncUsersService: SyncUsersService,
    private readonly syncGroupsService: SyncGroupsService,
    private readonly syncPlannersService: SyncPlannersService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sync' })
  async handle() {
    this.logger.log('Sync start');

    await this.syncUsersService.sync();
    await this.syncGroupsService.sync();
    await this.syncPlannersService.sync();

    this.logger.log('Sync finished');
  }
}
