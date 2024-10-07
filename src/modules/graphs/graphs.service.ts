import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { UsersService } from '../users/users.service';
import { DateRangeFilter, TasksPerDayDto } from './models/graphs.dto';
import {
  MAX_WORKED_HOURS_PER_DAY,
  MAX_WORKED_HOURS_PER_WEEK,
  TaskDay,
  TasksPerDay,
} from './models/graphs.entity';
import { GraphsRepository } from './repositories/graphs.repository';

@Injectable()
export class GraphsService {
  constructor(
    private readonly repository: GraphsRepository,
    private readonly usersService: UsersService,
  ) {}

  async calculateAllWorkedHours(filter: DateRangeFilter) {
    const users = await this.usersService.findAll();

    const result = users.map(async (user) => {
      const days = await this.calculateWorkedHours(user.id, filter);
      return {
        userId: user.id,
        userName: user.displayName,
        tasksPerDays: days,
      };
    });

    return Promise.all(result);
  }

  async calculateWorkedHours(
    userId: string,
    filter: DateRangeFilter,
  ): Promise<TasksPerDayDto> {
    const tasks = await this.repository.findAllTasksInYear(userId, filter);

    const tasksPerDay: Map<string, TasksPerDay>[] = tasks.map((task) => {
      const days = new Map<string, TasksPerDay>();

      let date = DateTime.fromJSDate(task.startDateTime);
      let hours = task.hours;
      let dayHours: number;

      while (hours !== 0) {
        if (hours >= MAX_WORKED_HOURS_PER_DAY) {
          dayHours = MAX_WORKED_HOURS_PER_DAY;
          hours -= MAX_WORKED_HOURS_PER_DAY;
        } else {
          dayHours = hours;
          hours = 0;
        }

        days.set(date.toISODate(), {
          totalHours: dayHours,
          tasks: [
            {
              taskId: task.id,
              title: task.title,
              hours: dayHours,
              status: task.status,
            },
          ],
          isWeekend: false,
        });

        if (date.weekday == 5) {
          date = date.plus({ days: 3 });
        } else {
          date = date.plus({ days: 1 });
        }
      }

      return days;
    });

    const mergedTasksPerDay = new Map<string, TasksPerDay>();
    let date = DateTime.now().set({ month: 1, day: 1 });
    const queue: TasksPerDay[] = [];

    while (!this.isLastDayOfYear(date)) {
      if (date.weekday == 6) {
        let totalWeekHours: number = 0;
        const totalWeekTasks: TaskDay[] = [];
        const taskIds = new Map<string, number>();

        let auxDate = date.minus({ days: 5 });

        for (let i = 0; i < 5; i++) {
          const currentDateISO = auxDate.toISODate();

          if (mergedTasksPerDay.has(currentDateISO)) {
            const dayData = mergedTasksPerDay.get(currentDateISO);
            totalWeekHours += dayData.totalHours;

            const tasks = dayData.tasks;

            for (const task of tasks) {
              const existingTaskIndex = taskIds.get(task.taskId);

              if (existingTaskIndex === undefined) {
                totalWeekTasks.push({ ...task });
                taskIds.set(task.taskId, totalWeekTasks.length - 1);
              } else {
                totalWeekTasks[existingTaskIndex].hours += task.hours;
              }
            }
          }

          auxDate = auxDate.plus({ days: 1 });
        }
        if (totalWeekHours > 0) {
          mergedTasksPerDay.set(date.toISODate(), {
            totalHours: totalWeekHours,
            tasks: totalWeekTasks,
            isWeekend: true,
            availableHours: MAX_WORKED_HOURS_PER_WEEK - totalWeekHours,
            workedHours: totalWeekHours,
          });
        }
      }

      const tasks: TasksPerDay[] = tasksPerDay.reduce((acc, map) => {
        if (map.has(date.toISODate())) {
          acc.push(map.get(date.toISODate()));
        }

        return acc;
      }, []);

      if (tasks.length === 0 && queue.length === 0) {
        date = date.plus({ days: 1 });
        continue;
      }

      let mergedHours = 0;
      let mergedTasks: TaskDay[] = [];

      tasks.map((task) => {
        if (mergedHours + task.totalHours <= MAX_WORKED_HOURS_PER_DAY) {
          mergedHours += task.totalHours;
          mergedTasks = mergedTasks.concat(task.tasks);
        } else if (mergedHours !== MAX_WORKED_HOURS_PER_DAY) {
          task.totalHours -= MAX_WORKED_HOURS_PER_DAY - mergedHours;
          task.tasks[0].hours = task.totalHours;
          console.log(mergedHours);
          mergedHours = MAX_WORKED_HOURS_PER_DAY;
          mergedTasks = mergedTasks.concat(task.tasks);

          queue.push(task);
        } else {
          queue.push(task);
        }
      });

      for (let index = 0; index < queue.length; index++) {
        const task = queue[index];

        if (mergedHours + task.totalHours <= MAX_WORKED_HOURS_PER_DAY) {
          mergedHours += task.totalHours;
          mergedTasks = mergedTasks.concat(task.tasks);
          queue.splice(index, 1);
          index--;
        } else if (mergedHours !== MAX_WORKED_HOURS_PER_DAY) {
          task.totalHours -= MAX_WORKED_HOURS_PER_DAY - mergedHours;
          task.tasks[0].hours = MAX_WORKED_HOURS_PER_DAY - mergedHours;
          console.log(MAX_WORKED_HOURS_PER_DAY - mergedHours);
          mergedHours = MAX_WORKED_HOURS_PER_DAY;
          mergedTasks = mergedTasks.concat(task.tasks);

          queue[index] = task;
        }
      }

      mergedTasksPerDay.set(date.toISODate(), {
        totalHours: mergedHours,
        tasks: mergedTasks,
        isWeekend: false,
      });

      date = date.plus({ days: 1 });
    }

    return Object.fromEntries(mergedTasksPerDay);
  }

  isLastDayOfYear(date: DateTime) {
    const lastDayOfYear = date.endOf('year');
    return date.hasSame(lastDayOfYear, 'day');
  }
}
