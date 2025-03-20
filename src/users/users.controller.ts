import { AuthGuard } from "@/auth/auth.guard";
import { Roles } from "@/auth/decorators/role.decorator";
import { PaginationQuery } from "@/common/queries/pagination.query";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./users.dto";
import { UsersService } from "./users.service";
import { UserRole } from "./users.type";

@Controller("users")
@UseGuards(AuthGuard)
@ApiTags("User")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SYSTEM)
  @ApiOperation({
    summary: "Get users",
    description:
      "Get users in system. This API only can be used by SYSTEM user",
  })
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  @Roles(UserRole.SYSTEM)
  @ApiOperation({
    summary: "Create user",
    description: "Create new user. This API only can be used by SYSTEM user",
  })
  async getUsers(@Query() query: PaginationQuery) {
    return this.usersService.getUsers(query);
  }
}
