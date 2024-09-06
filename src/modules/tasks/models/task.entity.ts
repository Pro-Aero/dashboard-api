export type TaskEntity = {
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
};

export type TaskApiResponse = {
  id: string;
  planId: string;
  bucketId: string;
  title: string;
  percentComplete: number;
  priority: number;
  startDateTime: Date;
  dueDateTime: Date;
  completedDateTime: Date;
};
