import { Injectable } from '@nestjs/common';
import { BucketEntity } from './models/bucket.entity';
import { BucketRepository } from './repositories/bucket.repository';
@Injectable()
export class BucketsService {
  constructor(private readonly repository: BucketRepository) {}

  async upsert(bucket: BucketEntity): Promise<void> {
    await this.repository.upsert(bucket);
  }

  async getAll(): Promise<BucketEntity[]> {
    return await this.repository.getAll();
  }

  async removeOutdated(apiBuckets: BucketEntity[]): Promise<void> {
    const dbBuckets = await this.repository.getAll();

    const apiBucketsMap = new Map(
      apiBuckets.map((bucket) => [bucket.id, bucket]),
    );
    const bucketsToRemove = dbBuckets.filter(
      (bucket) => !apiBucketsMap.has(bucket.id),
    );

    await Promise.all(
      bucketsToRemove.map(
        async (bucket) => await this.repository.remove(bucket.id),
      ),
    );
  }
}
