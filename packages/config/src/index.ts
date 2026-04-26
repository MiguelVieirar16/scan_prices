export interface AppConfig {
  nodeEnv: string;
  apiPort: number;
  apiBaseUrl: string;
  databaseUrl: string;
  databaseSsl: boolean;
  redisUrl: string;
  logLevel: string;
  fxProvider: string;
  fxFallbackRate: number;
  fxAdminKey: string;
}

export function loadConfig(): AppConfig {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    apiPort: Number(process.env.API_PORT ?? 4000),
    apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:4000",
    databaseUrl: process.env.DATABASE_URL ?? "",
    databaseSsl: process.env.DATABASE_SSL === "true",
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    logLevel: process.env.LOG_LEVEL ?? "info",
    fxProvider: process.env.FX_PROVIDER ?? "bcv",
    fxFallbackRate: Number(process.env.FX_FALLBACK_RATE ?? 92.5),
    fxAdminKey: process.env.FX_ADMIN_KEY ?? ""
  };
}
