import { User } from "@/users/users.type";

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
  assignee: User;
  creator: User;
  parent?: Task;
};
