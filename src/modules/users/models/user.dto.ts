import { IsOptional, IsString } from 'class-validator';

export type UserDto = {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail?: string;
  jobTitle?: string;
  busyHours?: number;
};

export class UserFilter {
  @IsOptional()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  mail: string;
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
  weeklyAvailability: {
    totalAvailableHours: number;
    hoursOccupied: number;
    hoursRemaining: number;
  };
};
