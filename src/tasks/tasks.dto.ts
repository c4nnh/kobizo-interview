import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "./tasks.type";

export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsString()
  @ApiProperty()
  assigneeId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  parentTaskId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TaskStatus,
  })
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  assigneeId?: string;

  // In case you forgot to add the parent task when create a task, you can update after that.
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  parentTaskId?: string;
}
