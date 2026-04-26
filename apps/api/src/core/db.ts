import { Pool } from "pg";
import { config } from "../config/env.js";

let pool: Pool | null = null;

export function hasDatabaseConfigured(): boolean {
  return Boolean(config.databaseUrl);
}

export function getDbPool(): Pool | null {
  if (!hasDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}
