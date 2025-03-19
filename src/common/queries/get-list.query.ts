import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "./pagination.query";

export class GetListQuery extends PaginationQuery {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: "createdAt",
  })
  orderBy?: string = "createdAt";

  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    default: true,
  })
  ascending?: boolean = true;

  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    default: false,
  })
  nullFirst?: boolean = false;
}
