import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
  ValidateIf,
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
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  notComplete: boolean;

  @IsOptional()
  @Transform(({ value }) => value?.split(','))
  @IsEnum(TaskStatus, { each: true })
  status: TaskStatus[];

  @IsOptional()
  @IsBoolean()
  isOverdue: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'startDate must be a valid date' })
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'endDate must be a valid date' })
  @ValidateIf((obj) => obj.startDate)
  @MinDate(new Date(), {
    message: 'endDate cannot be earlier than the current date',
  })
  endDate: Date;
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
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  notComplete: boolean;

  @IsOptional()
  @Transform(({ value }) => value?.split(','))
  @IsEnum(TaskStatus, { each: true })
  status: TaskStatus[];

  @IsOptional()
  @IsBoolean()
  isOverdue: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'startDate must be a valid date' })
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'endDate must be a valid date' })
  @ValidateIf((obj) => obj.startDate)
  @MinDate(new Date(), {
    message: 'endDate cannot be earlier than the current date',
  })
  endDate: Date;
}
