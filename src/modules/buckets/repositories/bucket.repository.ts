import { prisma } from 'src/config/prisma-client';
import { BucketsMapper } from '../mappers/bucket.mapper';
import { BucketEntity } from '../models/bucket.entity';

export class BucketRepository {
  async upsert(user: BucketEntity): Promise<void> {
    const data = BucketsMapper.entityToModel(user);

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

  async remove(userId: string): Promise<void> {
    await prisma.bucket.delete({ where: { id: userId } });
  }
}
