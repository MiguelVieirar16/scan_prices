import { Pool } from "pg";
import { config } from "../config/env.js";

let pool: Pool | null = null;

console.log("[DB] Database URL configured:", !!config.databaseUrl);
console.log("[DB] Database SSL:", config.databaseSsl);

export function hasDatabaseConfigured(): boolean {
  return Boolean(config.databaseUrl);
}

export function getDbPool(): Pool | null {
  console.log("[DB] getDbPool called, hasDatabaseConfigured:", hasDatabaseConfigured());
  if (!hasDatabaseConfigured()) {
    console.log("[DB] No database URL - returning null");
    return null;
  }

  if (!pool) {
    console.log("[DB] Creating new pool, SSL:", config.databaseSsl);
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}
