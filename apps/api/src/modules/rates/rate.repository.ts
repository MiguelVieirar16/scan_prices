export interface ExchangeRateRow {
  provider: string;
  value: number;
  fetchedAt: string;
  sourceType: "automatic" | "manual";
  note?: string;
}

const MAX_HISTORY = 200;

let latestRate: ExchangeRateRow = {
  provider: process.env.FX_PROVIDER ?? "bcv",
  value: Number(process.env.FX_FALLBACK_RATE ?? 92.5),
  fetchedAt: new Date().toISOString(),
  sourceType: "automatic",
  note: "fallback_rate_bootstrap"
};

const rateHistory: ExchangeRateRow[] = [latestRate];

export async function findLatestUsdVesRate(): Promise<ExchangeRateRow> {
  const dbRate = await findLatestUsdVesRateInDb();
  if (dbRate) {
    latestRate = dbRate;
    return dbRate;
  }

  return latestRate;
}

export async function setLatestUsdVesRate(input: {
  provider: string;
  value: number;
  sourceType: "automatic" | "manual";
  note?: string;
}): Promise<ExchangeRateRow> {
  const nextRate: ExchangeRateRow = {
    provider: input.provider,
    value: input.value,
    fetchedAt: new Date().toISOString(),
    sourceType: input.sourceType,
    note: input.note
  };

  await insertExchangeRateInDb(nextRate);

  latestRate = nextRate;
  rateHistory.unshift(latestRate);
  if (rateHistory.length > MAX_HISTORY) {
    rateHistory.splice(MAX_HISTORY);
  }

  return latestRate;
}

export async function findRateHistory(limit = 20): Promise<ExchangeRateRow[]> {
  const dbRows = await findRateHistoryInDb(limit);
  if (dbRows.length) {
    return dbRows;
  }

  return rateHistory.slice(0, Math.max(1, Math.min(limit, MAX_HISTORY)));
}

async function findLatestUsdVesRateInDb(): Promise<ExchangeRateRow | null> {
  const { getDbPool } = await import("../../core/db.js");
  const pool = getDbPool();

  if (!pool) {
    return null;
  }

  const query = `
    SELECT provider, value::float8 AS value, fetched_at, source_type, note
    FROM exchange_rates
    WHERE base_currency = 'USD'
      AND quote_currency = 'VES'
    ORDER BY effective_at DESC
    LIMIT 1
  `;

  try {
    const result = await pool.query<{
      provider: string;
      value: number;
      fetched_at: string;
      source_type: string;
      note: string | null;
    }>(query);

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      provider: row.provider,
      value: Number(row.value),
      fetchedAt: new Date(row.fetched_at).toISOString(),
      sourceType: row.source_type === "manual" ? "manual" : "automatic",
      note: row.note ?? undefined
    };
  } catch {
    return null;
  }
}

async function insertExchangeRateInDb(rate: ExchangeRateRow): Promise<void> {
  const { getDbPool } = await import("../../core/db.js");
  const pool = getDbPool();

  if (!pool) {
    return;
  }

  const query = `
    INSERT INTO exchange_rates (
      provider,
      base_currency,
      quote_currency,
      value,
      effective_at,
      fetched_at,
      source_type,
      note
    )
    VALUES (
      $1,
      'USD',
      'VES',
      $2,
      NOW(),
      NOW(),
      $3,
      $4
    )
  `;

  try {
    await pool.query(query, [rate.provider, rate.value, rate.sourceType, rate.note ?? null]);
  } catch {
    // fallback en memoria ya activo en el repositorio
  }
}

async function findRateHistoryInDb(limit = 20): Promise<ExchangeRateRow[]> {
  const { getDbPool } = await import("../../core/db.js");
  const pool = getDbPool();

  if (!pool) {
    return [];
  }

  const query = `
    SELECT provider, value::float8 AS value, fetched_at, source_type, note
    FROM exchange_rates
    WHERE base_currency = 'USD'
      AND quote_currency = 'VES'
    ORDER BY effective_at DESC
    LIMIT $1
  `;

  try {
    const result = await pool.query<{
      provider: string;
      value: number;
      fetched_at: string;
      source_type: string;
      note: string | null;
    }>(query, [Math.max(1, Math.min(limit, MAX_HISTORY))]);

    return result.rows.map((row) => ({
      provider: row.provider,
      value: Number(row.value),
      fetchedAt: new Date(row.fetched_at).toISOString(),
      sourceType: row.source_type === "manual" ? "manual" : "automatic",
      note: row.note ?? undefined
    }));
  } catch {
    return [];
  }
}
