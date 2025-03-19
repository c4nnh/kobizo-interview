import { PaginationQuery } from "@/common/queries/pagination.query";
import { EnvironmentVariables } from "@/common/types/env.type";
import { convertErrorCodeToException } from "@/common/utils/error.utils";
import { transformPaginationResponse } from "@/common/utils/pagination.utils";
import { SupabaseService } from "@/third-parties/supabase.service";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { CreateUserDto } from "./users.dto";

@Injectable({
  scope: Scope.REQUEST,
})
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createUser(dto: CreateUserDto) {
    this.request.context.logger.info("Create user", { dto });

    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          name: dto.name,
          role: dto.role,
        },
        emailRedirectTo: this.configService.get("EMAIL_CONFIRMATION_URL"),
      },
    });

    if (error) {
      this.request.context.logger.error("Create user failed", { error });
      throw convertErrorCodeToException(error.status);
    }

    return data;
  }

  async getUsers({ page, limit }: PaginationQuery) {
    this.request.context.logger.info("Get users", { page, limit });

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.admin.listUsers({
        page: page,
        perPage: limit,
      });

    if (error) {
      this.request.context.logger.error("Get users failed", { error });
      throw convertErrorCodeToException(error.status);
    }

    return {
      users: data.users,
      pagination: transformPaginationResponse({
        total: data.total,
        page,
        limit,
      }),
    };
  }
}
