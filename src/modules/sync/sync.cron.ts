import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncBucketsService } from './services/sync-buckets.service';
import { SyncGroupsService } from './services/sync-groups.service';
import { SyncPlannersService } from './services/sync-planners.service';
import { SyncTasksService } from './services/sync-tasks.service';
import { SyncUsersService } from './services/sync-users.service';

@Injectable()
export class SyncCron {
  private readonly logger = new Logger(SyncCron.name);

  constructor(
    private readonly syncUsersService: SyncUsersService,
    private readonly syncGroupsService: SyncGroupsService,
    private readonly syncPlannersService: SyncPlannersService,
    private readonly syncBucketsService: SyncBucketsService,
    private readonly syncTasksService: SyncTasksService,
  ) {}

  @Cron('0 */10 7-19 * * 1-5', { name: 'sync' })
  async handle() {
    this.logger.log('Sync start');

    try {
      await this.syncUsersService.sync();
      await this.syncGroupsService.sync();
      await this.syncPlannersService.sync();
      await this.syncBucketsService.sync();
      await this.syncTasksService.sync();
    } catch (error) {
      this.logger.error('Sync failed');
      this.logger.error(error);
    }

    this.logger.log('Sync finished');
  }
}
