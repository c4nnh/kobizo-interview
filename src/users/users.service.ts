import { SupabaseService } from "@/third-parties/supabase.service";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable({
  scope: Scope.REQUEST,
})
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getUsers() {
    const users = await this.supabaseService.getClient().auth.admin.listUsers();
    return users;
  }
}
