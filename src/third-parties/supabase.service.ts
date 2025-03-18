import { Database } from "@/common/types/database.type";
import { EnvironmentVariables } from "@/common/types/env.type";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.supabaseClient = createClient<Database>(
      this.configService.get<string>("SUPABASE_URL") as string,
      this.configService.get<string>("SUPABASE_KEY") as string,
    );
  }

  getClient() {
    return this.supabaseClient;
  }
}
