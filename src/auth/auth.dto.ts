import { ErrorCode } from "@/common/types/error.type";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class RegisterDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
    message: ErrorCode.NOT_MATCH_PASSWORD_COMPLEXITY_RULES,
  })
  @ApiProperty()
  password: string;
}

export class LoginDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
