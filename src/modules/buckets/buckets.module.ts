import { Module } from '@nestjs/common';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';
import { BucketRepository } from './repositories/bucket.repository';

@Module({
  controllers: [BucketsController],
  providers: [BucketsService, BucketRepository],
  exports: [BucketsService],
})
export class BucketsModule {}
