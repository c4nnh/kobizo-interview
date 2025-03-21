export type EnvironmentVariables = {
  NODE_ENV: "local" | "development" | "staging" | "production";
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  EMAIL_CONFIRMATION_URL: string;
  API_BASE_URL: string;
  BETTER_STACK_SOURCE_TOKEN?: string;
  SENTRY_DSN?: string;
  SENTRY_AUTH_TOKEN?: string;
  SENTRY_ORG?: string;
  SENTRY_PROJECT?: string;
};
