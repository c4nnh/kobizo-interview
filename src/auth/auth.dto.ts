import { ErrorCode } from "@/common/types/error.type";
import { IsString, Matches } from "class-validator";

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
    message: ErrorCode.NOT_MATCH_PASSWORD_COMPLEXITY_RULES,
  })
  password: string;
}

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
