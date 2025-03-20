import { ErrorCode } from "@/common/types/error.type";
import { convertErrorCodeToException } from "@/common/utils/error.utils";
import {
  transformPaginationQuery,
  transformPaginationResponse,
} from "@/common/utils/pagination.utils";
import { SupabaseService } from "@/third-parties/supabase.service";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { CreateTaskDto, UpdateTaskDto } from "./tasks.dto";
import { GetTasksQuery } from "./tasks.query";
import { Task } from "./tasks.type";

@Injectable({
  scope: Scope.REQUEST,
})
export class TasksService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createTask(dto: CreateTaskDto) {
    this.request.context.logger.info("Create task", { dto });

    const assignee = await this.supabaseService
      .getClient()
      .auth.admin.getUserById(dto.assigneeId);

    if (!assignee) {
      this.request.context.logger.error("Assignee not found");
      throw new NotFoundException(ErrorCode.ASSIGNEE_NOT_FOUND);
    }

    if (dto.parentTaskId) {
      await this.assertTask(dto.parentTaskId);
    }

    const { data, error, status } = await this.supabaseService
      .getClient()
      .from("Tasks")
      .insert({
        title: dto.title,
        description: dto.description,
        assigneeId: dto.assigneeId,
        creatorId: this.request.context.user.id,
        parentId: dto.parentTaskId,
      })
      .select()
      .single();

    if (error) {
      this.request.context.logger.error("Create task failed", { error });
      throw convertErrorCodeToException(status);
    }

    return data;
  }

  async getTasks(query: GetTasksQuery) {
    this.request.context.logger.info("Get tasks", { query });

    const { from, to } = transformPaginationQuery({
      page: query.page,
      limit: query.limit,
    });

    const supabaseQuery = this.supabaseService
      .getClient()
      .from("Tasks")
      .select("*", { count: "exact" });

    if (query.search) {
      supabaseQuery.textSearch("title", query.search);
    }

    if (query.status) {
      supabaseQuery.eq("status", query.status);
    }

    const { data, error, count, status } = await supabaseQuery
      .or(
        // We can assign task for admin
        // In case the authorized user is admin, they can get tasks that are assigned to them or created by them
        `creatorId.eq.${this.request.context.user.id},assigneeId.eq.${this.request.context.user.id}`,
      )
      .order(query.orderBy || "createdAt", {
        ascending: query.ascending,
        nullsFirst: query.nullFirst,
      })
      .range(from, to);

    if (error) {
      this.request.context.logger.error("Get tasks failed", { error });
      throw convertErrorCodeToException(status);
    }

    return {
      tasks: data,
      pagination: transformPaginationResponse({
        total: count || 0,
        page: query.page,
        limit: query.limit,
      }),
    };
  }

  async getTaskDetails(taskId: string) {
    this.request.context.logger.info("Get task details", { taskId });

    const task = await this.assertTask(taskId);

    if (
      ![task.creatorId, task.assigneeId].includes(this.request.context.user.id)
    ) {
      this.request.context.logger.error("Unauthorized to access task details");
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    return task;
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    this.request.context.logger.info("Update task", { taskId, dto });

    const task = await this.assertTask(taskId);

    // TODO: We can consider to check that only creator can update the task

    if (Object.values(dto).every((value) => !value)) {
      this.request.context.logger.info("No data to update");
      return task;
    }

    if (dto.parentTaskId === taskId) {
      this.request.context.logger.error(
        "Parent task cannot be the same as the task",
      );
      throw new BadRequestException(
        ErrorCode.PARENT_TASK_CANNOT_BE_THE_SAME_AS_THE_TASK,
      );
    }

    if (dto.parentTaskId) {
      await this.assertTask(dto.parentTaskId);
    }

    if (dto.assigneeId && dto.assigneeId !== task.assigneeId) {
      this.request.context.logger.info("Check assignee", {
        assigneeId: dto.assigneeId,
      });
      const assignee = await this.supabaseService
        .getClient()
        .auth.admin.getUserById(dto.assigneeId);

      if (!assignee) {
        this.request.context.logger.error("Assignee not found");
        throw new NotFoundException(ErrorCode.ASSIGNEE_NOT_FOUND);
      }
    }

    const { data, error, status } = await this.supabaseService
      .getClient()
      .from("Tasks")
      .update({
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assigneeId: dto.assigneeId,
        parentId: dto.parentTaskId,
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      this.request.context.logger.error("Update task failed", { error });
      throw convertErrorCodeToException(status);
    }

    return data;
  }

  async deleteTask(taskId: string) {
    this.request.context.logger.info("Delete task", { taskId });

    await this.assertTask(taskId);

    // TODO: We can consider to check that only creator can delete the task

    const { error, status } = await this.supabaseService
      .getClient()
      .from("Tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      this.request.context.logger.error("Delete task failed", { error });
      throw convertErrorCodeToException(status);
    }

    return {
      success: true,
    };
  }

  async getSubTasks(parentTaskId: string, query: GetTasksQuery) {
    this.request.context.logger.info("Get sub tasks", { parentTaskId, query });

    await this.assertTask(parentTaskId);

    const { from, to } = transformPaginationQuery({
      page: query.page,
      limit: query.limit,
    });

    const supabaseQuery = this.supabaseService
      .getClient()
      .from("Tasks")
      .select("*", { count: "exact" })
      .eq("parentId", parentTaskId)
      // When get sub tasks, we only get the tasks that are assigned to the authorized user
      // No need to get the tasks that are created by the authorized user
      .eq("assigneeId", this.request.context.user.id);

    if (query.search) {
      supabaseQuery.textSearch("title", query.search);
    }

    if (query.status) {
      supabaseQuery.eq("status", query.status);
    }

    const { data, error, count, status } = await supabaseQuery
      .order(query.orderBy || "createdAt", {
        ascending: query.ascending,
        nullsFirst: query.nullFirst,
      })
      .range(from, to);

    if (error) {
      this.request.context.logger.error("Get sub tasks failed", { error });
      throw convertErrorCodeToException(status);
    }

    return {
      tasks: data,
      pagination: transformPaginationResponse({
        total: count || 0,
        page: query.page,
        limit: query.limit,
      }),
    };
  }

  private async assertTask(taskId: string) {
    this.request.context.logger.info("Assert task", { taskId });

    const { data, error, status } = await this.supabaseService
      .getClient()
      .from("Tasks")
      .select()
      .eq("id", taskId)
      .maybeSingle();

    if (error) {
      this.request.context.logger.error("Error while asserting the task", {
        error: error,
      });
      throw convertErrorCodeToException(status);
    }

    if (!data) {
      this.request.context.logger.error("Task not found", { taskId });
      throw new NotFoundException(ErrorCode.TASK_NOT_FOUND);
    }

    return data as Task;
  }
}
