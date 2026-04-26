import { TenantSyncConnector } from "../types.js";

interface DbConnectorConfig {
  tenantCode: string;
  query: string;
  // Reemplazar con cliente SQL real (pg, mysql2, etc.)
  execute: (query: string) => Promise<Array<Record<string, unknown>>>;
}

export function createDbReadonlyConnector(config: DbConnectorConfig): TenantSyncConnector {
  return {
    tenantCode: config.tenantCode,
    async fetchLatestPrices() {
      const rows = await config.execute(config.query);

      return rows.map((row) => {
        return {
          barcode: String(row.barcode ?? ""),
          sku: String(row.sku ?? ""),
          productName: String(row.product_name ?? ""),
          storeCode: String(row.store_code ?? ""),
          currency: String(row.currency ?? "USD") as "USD" | "VES",
          amount: Number(row.amount ?? 0),
          observedAt: String(row.observed_at ?? new Date().toISOString())
        };
      });
    }
  };
}
