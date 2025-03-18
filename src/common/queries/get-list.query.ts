import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationQuery } from "./pagination.query";

export class GetListQuery extends PaginationQuery {
  @ApiPropertyOptional({
    default: "createdAt",
  })
  @IsOptional()
  orderBy?: string = "createdAt";

  @ApiPropertyOptional({
    default: true,
  })
  ascending?: boolean = true;

  @ApiPropertyOptional({
    default: false,
  })
  nullFirst?: boolean = false;
}
