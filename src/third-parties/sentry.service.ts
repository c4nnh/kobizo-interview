import { EnvironmentVariables } from "@/common/types/env.type";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

@Injectable()
export class SentryService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  init() {
    console.info("Init Sentry");

    const dsn = this.configService.get("SENTRY_DSN");

    if (!dsn) {
      console.info("No DSN provided. Ignore init Sentry.");
      return;
    }

    Sentry.init({
      dsn,
      integrations: [
        // Add our Profiling integration
        nodeProfilingIntegration(),
      ],

      // Add Tracing by setting tracesSampleRate
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Set sampling rate for profiling
      // This is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });
  }
}
