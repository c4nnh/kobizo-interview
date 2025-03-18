import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ContextMiddleware } from "./request-context.middleware";

@Module({})
export class MiddlewaresModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
