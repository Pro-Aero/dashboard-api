import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from './task.entity';

export type TaskDto = {
  id: string;
  plannerId: string;
  bucketId: string;
  title: string;
  percentComplete: number;
  priority: number;
  startDateTime?: Date;
  dueDateTime?: Date;
  completedDateTime?: Date;
  hours?: number;
  status?: TaskStatus;
  assignments?: string[];
};

export class TaskFilter {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  percentComplete: number;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: boolean;

  @IsOptional()
  @IsBoolean()
  isOverdue: boolean;
}
