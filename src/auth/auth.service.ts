import { EnvironmentVariables } from "@/common/types/env.type";
import { ErrorCode } from "@/common/types/error.type";
import { SupabaseService } from "@/third-parties/supabase.service";
import { UserRole } from "@/users/users.type";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { AuthResponse } from "@supabase/supabase-js";
import { Request } from "express";
import {} from "nestjs-supabase-auth";
import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable({
  scope: Scope.REQUEST,
})
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async register({ email, password, name }: RegisterDto) {
    this.request.context.logger.info("Register", { email, name });

    const response = await this.supabaseService.getClient().auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name,
          role: UserRole.USER,
        },
        emailRedirectTo: this.configService.get("EMAIL_CONFIRMATION_URL"),
      },
    });

    const { user } = this.assertAuthResponse(response);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role as UserRole,
        name: user.user_metadata.name,
      },
    };
  }

  async login({ email, password }: LoginDto) {
    this.request.context.logger.info("Login", { email });

    const response = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    const { user, session } = this.assertAuthResponse(response);

    if (!session) {
      this.request.context.logger.error("No session");
      throw new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role as UserRole,
        name: user.user_metadata.name,
      },
      tokens: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiredIn: session.expires_in,
        expiredAt: session.expires_at,
      },
    };
  }

  async verifyToken(token: string) {
    this.request.context.logger.info("Verify token", {
      token,
    });

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error) {
      this.request.context.logger.error("Can not verify token", { error });
      throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role as UserRole,
      name: data.user.user_metadata.name,
    };
  }

  private assertAuthResponse(authResponse: AuthResponse) {
    if (authResponse.error) {
      this.request.context.logger.error("Can not create user", {
        message: JSON.stringify(authResponse.error),
      });
      throw new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    const { user, session } = authResponse.data;

    if (!user) {
      this.request.context.logger.error("No user");
      throw new InternalServerErrorException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    return {
      user,
      session,
    };
  }
}
