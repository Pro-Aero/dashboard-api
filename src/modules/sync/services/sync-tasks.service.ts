import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { PlannersService } from 'src/modules/planners/planners.service';
import {
  TaskApiResponse,
  TaskEntity,
} from 'src/modules/tasks/models/task.entity';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { GraphClientService } from './graph-client.service';

type TaskResponse = {
  value: TaskApiResponse[];
};

@Injectable()
export class SyncTasksService {
  private client: Client;

  constructor(
    private readonly graphClientService: GraphClientService,
    private readonly plannersService: PlannersService,
    private readonly tasksService: TasksService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const planners = await this.plannersService.getAll();

    const tasksArray = await Promise.all(
      planners.map(async (planner) => this.getTasks(planner.id)),
    );

    const allTasks: TaskEntity[] = [];
    tasksArray.forEach((tasks) => allTasks.push(...tasks));

    await Promise.all(
      allTasks.map(async (task) => await this.tasksService.upsert(task)),
    );

    await this.tasksService.removeOutdated(allTasks);
  }

  async getTasks(plannerId: string): Promise<TaskEntity[]> {
    const { value }: TaskResponse = await this.client
      .api(`/planner/plans/${plannerId}/tasks`)
      .select(
        'id,planId,bucketId,title,percentComplete,priority,startDateTime,dueDateTime,completedDateTime',
      )
      .get();

    return value;
  }
}
