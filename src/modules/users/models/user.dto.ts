import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export type UserDto = {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail?: string;
  jobTitle?: string;
  busyHours?: number;
  show: boolean;
};

export class UserFilter {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  mail?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  show?: boolean;
}

export type UserTasksStatusDto = {
  userId: string;
  tasksSummary: {
    totalTasks: number;
    taskCountsByPriority: {
      low: number;
      medium: number;
      important: number;
      urgent: number;
    };
  };
  statusSummary: {
    totalTasks: number;
    taskCountsByStatus: {
      notStarted: number;
      inProgress: number;
      completed: number;
      nextOverdue: number;
      overdue: number;
    };
  };
};
