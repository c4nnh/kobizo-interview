import { PaginationQuery } from "@/common/queries/pagination.query";
import { ErrorCode } from "@/common/types/error.type";
import { transformPaginationResponse } from "@/common/utils/pagination.utils";
import { SupabaseService } from "@/third-parties/supabase.service";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({
  scope: Scope.REQUEST,
})
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly supabaseService: SupabaseService,
  ) {}

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
      throw new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR);
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
