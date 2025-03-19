import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { UserRole } from "./users.type";

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
