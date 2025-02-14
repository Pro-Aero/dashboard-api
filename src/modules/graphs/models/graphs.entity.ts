import { TaskStatus } from 'src/modules/tasks/models/task.entity';

export type TasksPerDay = {
  totalHours: number;
  tasks: TaskDay[];
  isWeekend: boolean;
};

export type TaskDay = {
  taskId: string;
  title: string;
  hours: number;
  status: TaskStatus;
};

export const MAX_WORKED_HOURS_PER_DAY = 6.5;
export const MAX_WORKED_HOURS_PER_WEEK = 32.5;
