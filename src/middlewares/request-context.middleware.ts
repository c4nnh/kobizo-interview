import { RequestContext } from "@/common/contexts/request.context";
import { LoggerService } from "@/common/services/logger.service";
import { EnvironmentVariables } from "@/common/types/env.type";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request } from "express";

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  use(req: Request, res, next: NextFunction) {
    const loggerService = new LoggerService(this.configService);
    const requestContext = new RequestContext(req, res, loggerService);
    req.context = requestContext;

    next();
  }
}
