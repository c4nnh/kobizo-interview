import { Logtail } from "@logtail/node";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../types/env.type";

@Injectable()
export class LoggerService {
  private data: object = {};
  private logger: Logtail;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    const betterStackSourceToken = this.configService.get(
      "BETTER_STACK_SOURCE_TOKEN",
    );
    if (betterStackSourceToken) {
      this.logger = new Logtail(betterStackSourceToken);
    } else {
      this.logger = console as unknown as Logtail;
    }
  }

  appendData(data: object) {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  info(message: string, data: object = {}) {
    this.logger.info(message, {
      level: "info",
      ...this.data,
      ...data,
    });
  }

  warn(message: string, data: object = {}) {
    this.logger.warn(message, {
      level: "warn",
      ...this.data,
      ...data,
    });
  }

  error(message: string, data: object = {}) {
    this.logger.error(message, {
      level: "error",
      ...this.data,
      ...data,
    });
  }
}
