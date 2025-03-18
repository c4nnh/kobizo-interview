import { ErrorCode } from "@/common/types/error.type";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { USER_ROLES_KEY } from "./decorators/role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      request.context.logger.error("No token provided");
      throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }
    const match = authHeader.match(/^Bearer (?<token>.+)$/);

    if (!match || !match.groups?.token) {
      request.context.logger.error("Invalid token format");
      throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }

    const user = await this.authService.verifyToken(match.groups.token);

    if (!user) {
      request.context.logger.error("Can not verify token");
      throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }

    const userRoles =
      this.reflector.get(USER_ROLES_KEY, context.getHandler()) || [];

    if (userRoles.length && !userRoles.some((role) => role === user.role)) {
      request.context.logger.error("Invalid user role", {
        userRoles,
        role: user.role,
      });
      throw new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    request.context.setUser(user);
    return true;
  }
}
