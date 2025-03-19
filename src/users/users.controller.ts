import { AuthGuard } from "@/auth/auth.guard";
import { Roles } from "@/auth/decorators/role.decorator";
import { PaginationQuery } from "@/common/queries/pagination.query";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  @Roles(UserRole.SYSTEM)
  async getUsers(@Query() query: PaginationQuery) {
    return this.usersService.getUsers(query);
  }
}
