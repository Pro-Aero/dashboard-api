import { prisma } from 'src/config/prisma-client';
import { BucketsMapper } from '../mappers/bucket.mapper';
import { BucketEntity } from '../models/bucket.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BucketRepository {
  async upsert(bucket: BucketEntity): Promise<void> {
    const data = BucketsMapper.entityToModel(bucket);

    await prisma.bucket.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async getAll(): Promise<BucketEntity[]> {
    const buckets = await prisma.bucket.findMany();
    return buckets.map(BucketsMapper.modelToEntity);
  }

  async remove(bucketId: string): Promise<void> {
    const bucket = await prisma.bucket.findUnique({ where: { id: bucketId } });
    if (bucket) await prisma.bucket.delete({ where: { id: bucketId } });
  }
}
