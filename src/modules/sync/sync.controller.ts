import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SyncCron } from './sync.cron';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncCron: SyncCron) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async executeSync() {
    await this.syncCron.handle();
  }
}
