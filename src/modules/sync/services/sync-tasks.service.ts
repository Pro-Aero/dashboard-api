import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { AssignmentsService } from 'src/modules/assignments/assignments.service';
import { PlannersService } from 'src/modules/planners/planners.service';
import { TasksMapper } from 'src/modules/tasks/mappers/task.mapper';
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
    private readonly assignmentsService: AssignmentsService,
  ) {
    this.client = this.graphClientService.getClient();
  }

  async sync() {
    const planners = await this.plannersService.findAll();

    const tasksArray = await Promise.all(
      planners.map(async (planner) => this.getTasks(planner.id)),
    );

    const allTasks: TaskEntity[] = [];
    tasksArray.forEach((tasks) => allTasks.push(...tasks));

    await Promise.all(
      allTasks.map(async (task) => {
        task.hours = this.tasksService.extractHoursFromTitle(task.title);
        await this.tasksService.upsert(task);

        Promise.all(
          task.assignments.map((assignment) =>
            this.assignmentsService.upsert({
              taskId: task.id,
              userId: assignment,
            }),
          ),
        );
      }),
    );

    await this.tasksService.removeOutdated(allTasks);

    Promise.all(
      planners.map(
        async (planner) =>
          await this.plannersService.calculateTotalHours(planner),
      ),
    );
  }

  async getTasks(plannerId: string): Promise<TaskEntity[]> {
    const { value }: TaskResponse = await this.client
      .api(`/planner/plans/${plannerId}/tasks`)
      .select(
        'id,planId,bucketId,title,percentComplete,priority,startDateTime,dueDateTime,completedDateTime,assignments',
      )
      .get();

    return value.map(TasksMapper.apiToEntity);
  }
}
