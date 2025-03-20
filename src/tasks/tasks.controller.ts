import { AuthGuard } from "@/auth/auth.guard";
import { Roles } from "@/auth/decorators/role.decorator";
import { UserRole } from "@/users/users.type";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTaskDto, UpdateTaskDto } from "./tasks.dto";
import { GetTasksQuery } from "./tasks.query";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(AuthGuard)
@ApiTags("Task")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Create task",
    description: "Create new task",
  })
  async createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body);
  }

  @Get()
  @ApiOperation({
    summary: "Get tasks",
    description: "Get tasks that are created by or assigned to current user",
  })
  async getTasks(@Query() query: GetTasksQuery) {
    return this.tasksService.getTasks(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get task",
    description: "Get task details",
  })
  async getTaskDetails(@Param("id") id: string) {
    return this.tasksService.getTaskDetails(id);
  }

  @Get(":parentId/subtasks")
  @ApiOperation({
    summary: "Get sub tasks",
    description:
      "Get sub tasks that are children of parent task and assigned to current user",
  })
  async getSubTasks(
    @Param("parentId") parentId: string,
    @Query() query: GetTasksQuery,
  ) {
    return this.tasksService.getSubTasks(parentId, query);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update task",
    description: "Update information of the task",
  })
  @Roles(UserRole.ADMIN)
  async updateTask(@Param("id") id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.updateTask(id, body);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete task",
    description: "Delete task",
  })
  @Roles(UserRole.ADMIN)
  async deleteTask(@Param("id") id: string) {
    return this.tasksService.deleteTask(id);
  }
}
