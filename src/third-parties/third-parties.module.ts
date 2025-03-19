import { Module } from "@nestjs/common";
import { ConfigModuleOptions } from "@nestjs/config";
import { SentryService } from "./sentry.service";
import { SupabaseService } from "./supabase.service";

@Module({
  providers: [SupabaseService, SentryService],
  exports: [SupabaseService, SentryService],
})
export class ThirdPartiesModule {
  static forRoot(options?: ConfigModuleOptions) {
    return {
      module: ThirdPartiesModule,
      global: options?.isGlobal || false,
    };
  }
}
