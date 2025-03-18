import { Module } from "@nestjs/common";
import { ConfigModuleOptions } from "@nestjs/config";
import { SupabaseService } from "./supabase.service";

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class ThirdPartiesModule {
  static forRoot(options?: ConfigModuleOptions) {
    return {
      module: ThirdPartiesModule,
      global: options?.isGlobal || false,
    };
  }
}
