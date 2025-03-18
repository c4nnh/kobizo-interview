import { AuthGuard } from "@/auth/auth.guard";
import { Roles } from "@/auth/decorators/role.decorator";
import { PaginationQuery } from "@/common/queries/pagination.query";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserRole } from "./users.type";

@Controller("users")
@UseGuards(AuthGuard)
@ApiTags("User")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SYSTEM)
  async getUsers(@Query() query: PaginationQuery) {
    return this.usersService.getUsers(query);
  }
}
