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
  assignments?: string[];
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
  assignments?: Assignments;
};

type Assignments = {
  [key: string]: unknown;
};
