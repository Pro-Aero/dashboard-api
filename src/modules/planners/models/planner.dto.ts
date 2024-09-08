import { IsOptional, IsString } from 'class-validator';

export type PlannerDto = {
  id: string;
  groupId: string;
  title: string;
  owner: string;
  totalHours?: number;
};

export class PlannerFilter {
  @IsOptional()
  @IsString()
  title: string;
}
