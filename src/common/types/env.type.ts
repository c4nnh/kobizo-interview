export type EnvironmentVariables = {
  NODE_ENV: "local" | "development" | "staging" | "production";
  PORT: number;
  JWT_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  EMAIL_CONFIRMATION_URL: string;
  BETTER_STACK_SOURCE_TOKEN?: string;
  SENTRY_DSN?: string;
};
