import { Bucket, Prisma } from '@prisma/client';
import { BucketDto } from '../models/bucket.dto';
import { BucketApiResponse, BucketEntity } from '../models/bucket.entity';

export class BucketsMapper {
  static modelToEntity(raw: Bucket): BucketEntity {
    const entity: BucketEntity = {
      id: raw.id,
      plannerId: raw.plannerId,
      name: raw.name,
    };

    return entity;
  }

  static entityToModel(entity: BucketEntity): Prisma.BucketCreateInput {
    return {
      id: entity.id,
      planner: { connect: { id: entity.plannerId } },
      name: entity.name,
    };
  }

  static entityToDTO(entity: BucketEntity): BucketDto {
    return {
      id: entity.id,
      plannerId: entity.plannerId,
      name: entity.name,
    };
  }

  static apiToEntity(response: BucketApiResponse): BucketEntity {
    return {
      id: response.id,
      plannerId: response.planId,
      name: response.name,
    };
  }
}
