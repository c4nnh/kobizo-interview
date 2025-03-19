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
import { ApiTags } from "@nestjs/swagger";
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
  async createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body);
  }

  @Get()
  async getTasks(@Query() query: GetTasksQuery) {
    return this.tasksService.getTasks(query);
  }

  @Get(":id")
  async getTaskDetails(@Param("id") id: string) {
    return this.tasksService.getTaskDetails(id);
  }

  @Get(":parentId/subtasks")
  async getSubTasks(
    @Param("parentId") parentId: string,
    @Query() query: GetTasksQuery,
  ) {
    return this.tasksService.getSubTasks(parentId, query);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  async updateTask(@Param("id") id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.updateTask(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async deleteTask(@Param("id") id: string) {
    return this.tasksService.deleteTask(id);
  }
}
