import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { BucketsService } from 'src/modules/buckets/buckets.service';
import { BucketsMapper } from 'src/modules/buckets/mappers/bucket.mapper';
import {
  BucketApiResponse,
  BucketEntity,
} from 'src/modules/buckets/models/bucket.entity';
import { PlannersService } from 'src/modules/planners/planners.service';
import { GraphClientService } from './graph-client.service';

type BucketResponse = {
  value: BucketApiResponse[];
};

@Injectable()
export class SyncBucketsService {
  private client: Client;

  constructor(
    private readonly graphClientService: GraphClientService,
    private readonly plannersService: PlannersService,
    private readonly bucketsService: BucketsService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const planners = await this.plannersService.getAll();

    const bucketsArray = await Promise.all(
      planners.map(async (planner) => this.getBuckets(planner.id)),
    );

    const allBuckets: BucketEntity[] = [];
    bucketsArray.forEach((buckets) => allBuckets.push(...buckets));

    await Promise.all(
      allBuckets.map(
        async (bucket) => await this.bucketsService.upsert(bucket),
      ),
    );

    await this.bucketsService.removeOutdated(allBuckets);
  }

  async getBuckets(plannerId: string): Promise<BucketEntity[]> {
    const { value }: BucketResponse = await this.client
      .api(`/planner/plans/${plannerId}/buckets`)
      .select('id,planId,name')
      .get();

    return value.map(BucketsMapper.apiToEntity);
  }
}
