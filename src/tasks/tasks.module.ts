import { AuthModule } from "@/auth/auth.module";
import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
