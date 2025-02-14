import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { DateTime } from 'luxon';
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
  endDate: Date;

  constructor(startDate?: Date, endDate?: Date) {
    const now = DateTime.now();
    this.startDate = startDate ?? now.startOf('year').toJSDate();
    this.endDate = endDate ?? now.endOf('year').toJSDate();
  }

  static fromObject(obj: Partial<DateRangeFilter>): DateRangeFilter {
    return new DateRangeFilter(obj.startDate, obj.endDate);
  }
}
