import { Type } from 'class-transformer';
import { IsDate, IsOptional, MinDate, ValidateIf } from 'class-validator';
import { TasksPerDay } from './graphs.entity';

export type TasksPerDayDto = {
  [k: string]: TasksPerDay;
};

export type TeamWorkedHoursDto = {
  userId: string;
  userName: string;
  tasksPerDays: TasksPerDayDto;
};

export type UserWeekAvailableDto = {
  userId: string;
  userName: string;
  workedHours: number;
  availableHours: number;
  maxWorkedHours: number;
};

export class DateRangeFilter {
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
