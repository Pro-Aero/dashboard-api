export type PlannerEntity = {
  id: string;
  groupId: string;
  title: string;
  owner: string;
  totalHours?: number;
};

export type PlannerApiResponse = {
  id: string;
  title: string;
  owner: string;
  container: Container;
};

type Container = {
  containerId: string;
  type: string;
  url: string;
};
