import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import * as uuid from "uuid";
import { LoggerService } from "../services/logger.service";
import { RequestUser } from "../types/request.type";

@Injectable()
export class RequestContext {
  user: RequestUser;

  constructor(
    private readonly req: Request,
    private readonly res: Response,
    readonly logger: LoggerService,
  ) {
    // Init request id
    const requestId: string = uuid.v4();

    // Init logger
    this.logger.appendData({ requestId });

    const { password: _, ...body } = this.req.body || {};

    this.logger.info("Incoming request", {
      method: this.req.method,
      path: this.req.path,
      body,
      query: this.req.query,
    });

    // // Request duration
    const startTime = Date.now();

    this.res.on("finish", () => {
      const endTime = Date.now();
      this.logger.info("Request duration", {
        startTime,
        endTime,
        duration: endTime - startTime,
      });

      this.logger.info("Response", {
        statusCode: this.res.statusCode,
      });
    });

    // Attach request id to response
    this.res.setHeader("request-id", requestId);
  }

  setUser(user: RequestUser) {
    this.user = user;
    this.logger.appendData({ userId: this.user.id });
  }
}
