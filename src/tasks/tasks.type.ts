export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId: string;
  creatorId: string;
  parentId?: Task;
};
