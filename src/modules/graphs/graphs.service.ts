import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TaskEntity } from '../tasks/models/task.entity';
import { ShowUsersFilter } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import {
  DateRangeFilter,
  TasksPerDayDto,
  TeamWorkedHoursDto,
  UserWeekAvailableDto,
} from './models/graphs.dto';
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

  async calculateTeamWorkedGraph(
    filter: DateRangeFilter,
  ): Promise<TeamWorkedHoursDto[]> {
    const users = await this.usersService.findAll({ show: true });

    const result: TeamWorkedHoursDto[] = [];

    for (const user of users) {
      const days = await this.calculateUserWorkedGraph(user.id, filter);
      result.push({
        userId: user.id,
        userName: user.displayName,
        tasksPerDays: days,
      });
    }

    return result;
  }

  async calculateUserWorkedGraph(
    userId: string,
    filter: DateRangeFilter,
  ): Promise<TasksPerDayDto> {
    const tasks = await this.repository.findAllUserTasks(userId, filter);
    const calendar = new Map<string, TasksPerDay>();

    let currentDate = DateTime.fromJSDate(filter.startDate);
    while (currentDate.toJSDate() <= filter.endDate) {
      const dateStr = currentDate.toFormat('yyyy-MM-dd');
      const dayOfWeek = currentDate.weekday;
      calendar.set(dateStr, {
        totalHours: 0,
        tasks: [],
        isWeekend: dayOfWeek >= 6,
      });

      currentDate = currentDate.plus({ days: 1 });
    }

    const queue: TaskEntity[] = [];

    currentDate = DateTime.fromJSDate(filter.startDate);
    while (currentDate.toJSDate() <= filter.endDate) {
      const dateStr = currentDate.toFormat('yyyy-MM-dd');
      const day = calendar.get(dateStr);

      if (day.isWeekend) {
        let tempDate = currentDate;
        let sum = 0;
        const weekTasks: TaskDay[] = [];
        for (let i = 0; i < 5; i++) {
          tempDate = tempDate.minus({ days: 1 });
          const dateStr = tempDate.toFormat('yyyy-MM-dd');
          const day = calendar.get(dateStr);
          if (day) {
            sum += day.totalHours;
            weekTasks.push(...day.tasks);
          }
        }

        const dateStr2 = currentDate.plus({ days: 1 }).toFormat('yyyy-MM-dd');
        const tomorrow = calendar.get(dateStr2);

        day.totalHours = MAX_WORKED_HOURS_PER_WEEK - sum;
        day.tasks = weekTasks;
        tomorrow.totalHours = sum;
        tomorrow.tasks = weekTasks;

        calendar.set(dateStr, day);
        calendar.set(dateStr2, tomorrow);

        currentDate = currentDate.plus({ days: 2 });
        continue;
      }

      let task = this.removeTaskByDate(tasks, queue, currentDate.toJSDate());
      if (!task) {
        currentDate = currentDate.plus({ days: 1 });
        continue;
      }

      if (task.hours < MAX_WORKED_HOURS_PER_DAY) {
        day.totalHours += task.hours;
        day.tasks.push(this.toTaskDay(task));
        do {
          task = this.removeTaskByDate(tasks, queue, currentDate.toJSDate());
          if (!task) break;
          if (day.totalHours + task.hours < MAX_WORKED_HOURS_PER_DAY) {
            day.totalHours += task.hours;
            day.tasks.push(this.toTaskDay(task));
          } else if (day.totalHours + task.hours === MAX_WORKED_HOURS_PER_DAY) {
            day.totalHours = MAX_WORKED_HOURS_PER_DAY;
            day.tasks.push(this.toTaskDay(task));
          } else {
            const hourDiff = MAX_WORKED_HOURS_PER_DAY - day.totalHours;
            day.tasks.push(this.toTaskDay({ ...task, hours: hourDiff }));
            task.hours -= hourDiff;
            queue.push(task);
            day.totalHours = MAX_WORKED_HOURS_PER_DAY;
          }
        } while (day.totalHours !== MAX_WORKED_HOURS_PER_DAY);
      } else if (task.hours === MAX_WORKED_HOURS_PER_DAY) {
        day.totalHours = MAX_WORKED_HOURS_PER_DAY;
        day.tasks.push(this.toTaskDay(task));
      } else {
        const hourDiff = MAX_WORKED_HOURS_PER_DAY;
        day.tasks.push(this.toTaskDay({ ...task, hours: hourDiff }));
        day.totalHours = hourDiff;
        task.hours = task.hours - hourDiff;
        queue.push(task);
      }

      calendar.set(dateStr, day);
      currentDate = currentDate.plus({ days: 1 });
    }

    return Object.fromEntries(calendar);
  }

  toTaskDay(task: TaskEntity): TaskDay {
    return {
      taskId: task.id,
      title: task.title,
      hours: task.hours,
      status: task.status,
    };
  }

  removeTaskByDate(
    tasks: TaskEntity[],
    queue: TaskEntity[],
    targetDate: Date,
  ): TaskEntity | null {
    if (queue.length > 0) return queue.shift();

    const index = tasks.findIndex((t) => {
      const taskStartDate = DateTime.fromJSDate(t.startDateTime).startOf('day');
      const targetEndOfDay = DateTime.fromJSDate(targetDate).endOf('day');
      return taskStartDate <= targetEndOfDay;
    });

    if (index !== -1) {
      const task = tasks[index];
      tasks.splice(index, 1);
      return task;
    } else {
      return null;
    }
  }

  async calculateTeamWorkedHours(
    filter: DateRangeFilter,
  ): Promise<TeamWorkedHoursDto[]> {
    let users = await this.usersService.findAll();
    users = users.filter((user) => !ShowUsersFilter.includes(user.mail));

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

  async calculateWeekAvailable(userId: string): Promise<UserWeekAvailableDto> {
    const user = await this.usersService.findById(userId);

    const now = DateTime.local();

    const filter: DateRangeFilter = {
      startDate: now.startOf('week').toJSDate(),
      endDate: now.endOf('week').toJSDate(),
    };

    const days = await this.calculateWorkedHours(user.id, filter);

    const saturday = now
      .endOf('week')
      .minus({ days: 1 })
      .toFormat('yyyy-MM-dd');
    const sunday = now.endOf('week').toFormat('yyyy-MM-dd');

    if (Object.keys(days).length === 0) {
      return {
        userId: user.id,
        userName: user.displayName,
        workedHours: 0,
        availableHours: MAX_WORKED_HOURS_PER_WEEK,
        maxWorkedHours: MAX_WORKED_HOURS_PER_WEEK,
      };
    }

    return {
      userId: user.id,
      userName: user.displayName,
      availableHours: days[saturday].totalHours,
      workedHours: days[sunday].totalHours,
      maxWorkedHours: MAX_WORKED_HOURS_PER_WEEK,
    };
  }

  async calculateWorkedHours(
    userId: string,
    filter: DateRangeFilter,
  ): Promise<TasksPerDayDto> {
    const tasks = await this.repository.findAllUserTasks(userId, filter);
    const tasksPerDay = await this.calculateTasksPerDay(tasks);
    const mergedTasksPerDay = await this.mergeTasksPerDay(tasksPerDay);

    return Object.fromEntries(mergedTasksPerDay);
  }

  async calculateTasksAndWorkedHours(userId: string, filter: DateRangeFilter) {
    const tasks = await this.repository.findAllUserTasks(userId, filter);
    const tasksPerDay = await this.calculateTasksPerDay(tasks);
    const mergedTasksPerDay = await this.mergeTasksPerDay(tasksPerDay);
    const groupMergedTasks = this.groupMergedTasksPerDay(mergedTasksPerDay);

    const result = {
      tasks: tasks.map((task) => {
        return {
          taskInfo: task,
          taskPerDay: Object.fromEntries(groupMergedTasks.get(task.id)),
        };
      }),
      totalTasksPerDay: Object.fromEntries(mergedTasksPerDay),
    };

    return result;
  }

  async calculateTasksPerDay(
    tasks: TaskEntity[],
  ): Promise<Map<string, TasksPerDay>[]> {
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

    return tasksPerDay;
  }

  async mergeTasksPerDay(
    tasksPerDay: Map<string, TasksPerDay>[],
  ): Promise<Map<string, TasksPerDay>> {
    let date = DateTime.now().set({ month: 1, day: 1 });
    const mergedTasksPerDay = new Map<string, TasksPerDay>();
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
            totalHours: MAX_WORKED_HOURS_PER_WEEK - totalWeekHours,
            tasks: totalWeekTasks,
            isWeekend: true,
          });
          mergedTasksPerDay.set(date.plus({ days: 1 }).toISODate(), {
            totalHours: totalWeekHours,
            tasks: totalWeekTasks,
            isWeekend: true,
          });
        }
      }

      const tasks: TasksPerDay[] = tasksPerDay.reduce((acc, taskMap) => {
        if (taskMap.has(date.toISODate())) {
          acc.push(taskMap.get(date.toISODate()));
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

    return mergedTasksPerDay;
  }

  groupMergedTasksPerDay(
    mergedTasksPerDay: Map<string, TasksPerDay>,
  ): Map<string, Map<string, TasksPerDay>> {
    const tasks = new Map<string, Map<string, TasksPerDay>>();

    mergedTasksPerDay.forEach((value, key) => {
      if (value.isWeekend) return;

      value.tasks.map((task) => {
        if (!tasks.has(task.taskId)) {
          const day = new Map<string, TasksPerDay>();

          day.set(key, {
            totalHours: task.hours,
            tasks: [task],
            isWeekend: false,
          });

          tasks.set(task.taskId, day);
        } else {
          const day = tasks.get(task.taskId);

          day.set(key, {
            totalHours: task.hours,
            tasks: [task],
            isWeekend: false,
          });
        }
      });
    });

    return tasks;
  }

  isLastDayOfYear(date: DateTime) {
    const lastDayOfYear = date.endOf('year');
    return date.hasSame(lastDayOfYear, 'day');
  }
}
