import { AuthGuard } from "@/auth/auth.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
