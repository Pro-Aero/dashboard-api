import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQuery } from 'src/types/pagination-query';
import { PlannerInTask, TaskStatus, UserAssignment } from './task.entity';

export type TaskDto = {
  id: string;
  bucketId: string;
  title: string;
  percentComplete: number;
  priority: number;
  startDateTime?: Date;
  dueDateTime?: Date;
  completedDateTime?: Date;
  hours?: number;
  status?: TaskStatus;
  planner?: PlannerInTask;
  assignments?: UserAssignment[];
};

export class TaskFilter {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  percentComplete: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsBoolean()
  isOverdue: boolean;
}

export class PaginationQueryWithTaskFilter extends PaginationQuery {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  percentComplete: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsBoolean()
  isOverdue: boolean;
}
