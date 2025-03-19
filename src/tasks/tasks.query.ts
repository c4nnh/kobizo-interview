import { GetListQuery } from "@/common/queries/get-list.query";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { TaskStatus } from "./tasks.type";

export class GetTasksQuery extends GetListQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  status?: TaskStatus;
}
