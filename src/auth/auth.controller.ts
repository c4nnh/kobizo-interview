import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./auth.dto";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle(3, 60)
  @Post("register")
  @ApiOperation({
    summary: "Register user",
    description: "Register a new user",
  })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @Post("login")
  @HttpCode(200)
  @ApiOperation({
    summary: "Login",
    description: "Login into system by using verified user credentials",
  })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @Put("refresh-token")
  @ApiOperation({
    summary: "Generate new access token and refresh token",
    description:
      "Create new pair of tokens from refresh token in case you access token is expired",
  })
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get user information",
    description: "Get information of current authorized user",
  })
  async me(@Request() request) {
    return request.context.user;
  }
}
